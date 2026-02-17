---
title: Backing Up MariaDB With WAL-G To S3
date: 15 February 2026
image: /bigstock-Database-Copies.jpg
category: Backend,Databases
author: Omanjie Dominic
authorImage: /domanjie.jpeg
---

In this write up, I am going to show you how to fully backup a MariaDB database to s3 and add support for point in time recovery using the WAL-G database tool.

WAL-G is a tool for encrypting, compressing, storing and retrieving PostgreSQL, MySQL/MariaDB, and MS SQL Server backups to/from storage without saving/spilling it on your filesystem.

WAL-G's advantage over traditional backup tools (mysqldump, mariadb-backup etc) is that it is highly scalable, has various compression and encryption options, and can be configured to backup to an external store without spilling any data to local disk. Internally wal-g still makes use of these traditional backup tools.

### Installation

You can get WAL-G by downloading one of its precompiled Linux binaries under the releases tab on the official wal-g Github repository. For Mariadb, we use the precompiled binary for mysql. More details on installation can be found [here](https://wal-g.readthedocs.io/#installation)

> WAL-G primarily runs on Linux but can be installed on [windows](https://wal-g.readthedocs.io/Windows/#installing) as it is supported through wsl.

### Configuration & Usage

WAL-G can be configured through a config file or by setting relevant environment variables. We'll be going with the config file route.

Here is a simple config file template you could use. It's an env file and could be named \[anything\].env. Have a look then we'll get to the implication of each variable.

```bash
WALG_MYSQL_DATASOURCE_NAME="[user]:[pass]@tcp(localhost:3306)/mysql"

WALG_MYSQL_CREATE_COMMAND="mariadb-backup --backup --stream=xbstream --datadir=/var/lib/mysql --user=[user] --password=[pass]"

WALG_STREAM_RESTORE_COMMAND="mbstream -x C /var/lib/mysql"

WALG_MYSQL_BACKUP_PREPARE_COMMAND="mariadb-backup --prepare --target-dir=/var/lib/mysql"


WALG_LIBSODIUM_KEY="**********"

WALG_LIBSODIUM_KEY_TRANSFORM="hex"


WALG_S3_PREFIX="***********"

AWS_ACCESS_KEY_ID="***********"

AWS_SECRET_ACCESS_KEY="**********"
```

- `WALG_MYSQL_DATASOURCE_NAME`: This variable configures the connection string for MySQL. It is **required** and must be in [DSN format](https://github.com/go-sql-driver/mysql#dsn-data-source-name) e.g `[user]:[password]@tcp(host)/dbname`.
  To avoid running wal-g as root, I would advise you create a specialized MariaDB user for the wal-g backup process. This can be done with the following commands in the MariaDB cli:

  ```sql
  -- For Mariadb Version >=10.5
  CREATE USER 'mariadb-backup'@'localhost' IDENTIFIED BY 'mypassword';
  GRANT RELOAD, PROCESS, LOCK TABLES, BINLOG MONITOR ON *.* TO 'mariadb-backup'@'localhost';

  -- For Mariadb Version <10.5
  CREATE USER 'mariadb-backup'@'localhost' IDENTIFIED BY 'mypassword';
  GRANT RELOAD, PROCESS, LOCK TABLES, REPLICATION CLIENT ON *.* TO 'mariadb-backup'@'localhost';
  ```

  Replace \[user] and \[pass] placeholders in the template with the created user name and password.

- `WALG_MYSQL_CREATE_COMMAND`: This variable specifies the command wal-g uses to create the base DB backup . The command should output the backup as a single stream to STDOUT. The variable is set to `mariadb-backup --backup --stream=xbstream --datadir=/var/lib/mysql --user=[user] --password=[pass]` in the template above. The command creates a physical backup stream to STDOUT. Internally wal-g pipes this stream directly to our configured storage. Alternatively, we could use **mariadb-dump** to create a logical backup by setting the variable to `mariadb-dump --all-databases --single-transaction --set-gtid-purged=ON` but it is recommended to stick with the physical backup(mariadb-backup) alternative as it is faster and significantly reduces lock usage and lock time in comparison to its logical counterpart.

- `WALG_STREAM_RESTORE_COMMAND`: This variable specifies the command wal-g redirects the previously stored backup stream into when performing restoration. In the template above , the variable is set to `mbstream -x C /var/lib/mysql` where **mbstream** unpacks the previously stored physical backup streams wal-g provides to its STDIN into the data directory (/var/lib/mysql). If you opted for logical backup with **mariadb-dump** previously, set the variable to `mariadb` so wal-g provides the logical backup to the MariaDB cli's STDIN.

- `WALG_MYSQL_BACKUP_PREPARE_COMMAND`: This variable is only required if you went the route of physical backups with mariadb-backup. The command ensures data files in the MariaDB data directory are consistent after they've been unpacked by the WALG_STREAM_RESTORE_COMMAND. Delete the variable if you opted for the logical backup route.

- `WALG_LIBSODIUM_KEY`: This variable specifies a random 32 byte symmetric secret key. Internally, wal-g uses this key to encrypt backups during backup creation with the libsodium library. The chacha20-poly1305 stream cipher is the encryption algorithm used internally. wal-g also supports other encryption alternatives such as pgp, yandex kms etc. More details can be found [here](https://wal-g.readthedocs.io/#encryption).
  To replace the placeholder key in template above, you can generate a secure random 32 byte key with either `openssl rand -hex 32` (then set `WALG_LIBSODIUM_KEY_TRANSFORM`= _hex_ ) or `openssl rand -base64 32` (then set `WALG_LIBSODIUM_KEY_TRANSFORM`= _base64_ )

  > [!WARNING]
  > Ensure you replace the placeholders in the template!

- `WALG_S3_PREFIX` : s3 URI of the directory where backups are pushed to in the s3 bucket (e.g. `s3://bucket/path/to/folder`).

- `AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY`: The value for these variables are obtained by creating a new access key for an AWS IAM user that has permissions to read, write, list and delete from the s3 storage bucket.
  > [!WARNING]
  > Create a dedicated user with just these permissions and ensure you block public access to the bucket!

With the completion of the config file, to create a new backup and push to the configured storage run:

```bash
wal-g backup-push --config /path/to/wal-g.env
```

You could run this nightly with cron.

To list available backup files in the s3 bucket:

```bash
wal-g backup-list --config /path/to/wal-g.env
```

To fetch an available backup and restore into the data directory run:

```bash
wal-g backup-fetch [backup_name] --config /path/to/wal-g.env
```

where \[backup_name] could be the name of any backup in the storage.

To fetch and restore latest backup:

```bash
wal-g backup-fetch LATEST --config /path/to/wal-g.env
```

Stop reading here if regular full backups is all you need.

## Adding support for PITR(Point-in-time-recovery)

Point-in-time recovery (PITR) is the ability to restore data or a system to a specific point in time minimizing data loss to a smaller window, in case of database failure or corruption.

Point-in-time-recovery in MariaDB is made possible through its binary logs. Binary logs are logs of all SQL statements that changed data (CREATE, ALTER, INSERT, UPDATE, DELETE). These logs can be applied against a consistent backup of a MariaDB database to provide up-to-the-minute recovery of the database. To implement PITR for MariaDB with wal-g we:

1. Enable MariaDB Binary logs (They are disabled by default). You can find guidance for doing this [here](https://mariadb.com/docs/server/server-management/server-monitoring-logs/binary-log/activating-the-binary-log)
2. Using wal-g's _binlog-push_ directive we send unarchived binlogs to the configured storage:

   ```bash
   wal-g binlog-push --config /path/to/wal-g.env
   ```

   This command is typically run in cron and how often is determined by your application's recovery point objective (how much data loss your business can tolerate, measured in time).

3. Add `WALG_MYSQL_BINLOG_DST` to your config file. The variable specifies the folder in which binlogs fetched from the configured storage would be stored. For example, you could set it to the _/tmp_ directory in linux.

4. Add and set the variable `WALG_MYSQL_BINLOG_REPLAY_COMMAND` to `'mariadb-binlog --stop-datetime="$WALG_MYSQL_BINLOG_END_TS" "$WALG_MYSQL_CURRENT_BINLOG" | mariadb'` . This command replays the fetched binary logs by using the mariadb-binlog utility to convert the logs from binary to text format and passing the converted logs into MariaDB cli's STDIN.

5. To fetch and replay binlogs on a running MariaDB instance starting from a base-backup up to a specific point in time:

   ```bash
   wal-g binlog-replay --since [backup_name] --until [RFC3339-timestamp] --config /path/to/wal-g.env
   ```

   Internally the command fetches the binlogs and passes them to the command specified in the WALG_MYSQL_BINLOG_REPLAY_COMMAND variable. If you do not specify the --until option then it fetches all binlogs since the specified base backup. To fetch and replay all binlogs since the latest backup:

   ```bash
   wal-g binlog-replay --since LATEST --config /path/to/wal-g.env
   ```

Replaying the binlogs reapplies all statements in the logs, effectively restoring data in the db up to a particular point in time.

We've seen how to backup a MariaDB database to s3 and add support for PITR with wal-g, as next steps you could automate this process by scheduling the backup commands with cron.
You could also add bucket policies to your s3 bucket to move very old backups to a different storage class or automatically delete them after a particular period.
