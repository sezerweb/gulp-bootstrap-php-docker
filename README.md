# Gulp Starter Project

# PHP-phpMyAdmin-Adminer-MySQL Docker Compose


With this project you can quickly run the following:

- [PHP](https://hub.docker.com/_/php/)
- [phpMyAdmin](https://hub.docker.com/r/phpmyadmin/phpmyadmin/)
- [Adminer](https://hub.docker.com/_/adminer)
- [MySQL](https://hub.docker.com/_/mysql/)

Contents:

- [Requirements](#requirements)
- [Configuration](#configuration)
- [Installation](#installation)
- [Usage](#usage)

## Requirements

Make sure you have the latest versions of **Docker** and **Docker Compose** installed on your machine.

Clone this repository or copy the files from this repository into a new folder. In the **docker-compose.yml** file you may change the IP address (in case you run multiple containers) or the database from MySQL to MariaDB.

Make sure to [add your user to the `docker` group](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user) when using Linux.

## Configuration

Edit the `.env` file to change the default IP address,Ports, MySQL root password, user.

## Installation

Open a terminal and `cd` to the folder in which `docker-compose.yml` is saved and run:

```
docker-compose up
```

This creates three new folders next to your `docker-compose.yml` file.

* `db-data` – used to store and restore database dumps
* `src` – the location of your PHP codes
* `php-conf` – the location of your custom php.ini file

The containers are now built and running. You should be able to access the installation with the configured IP in the browser address. By default it is `http://127.0.0.1`.

For convenience you may add a new entry into your hosts file.

## Usage

### Starting containers

You can start the containers with the `up` command in daemon mode (by adding `-d` as an argument) or by using the `start` command:

```
docker-compose start
```

### Stopping containers

```
docker-compose stop
```

### Removing containers

To stop and remove all the containers use the `down` command:

```
docker-compose down
```

### Project from existing source

Copy the `docker-compose.yml` file into a new directory. In the directory you create three folders:

* `db-data` – here you add the database dump
* `src` – here you copy your existing php code
* `php-conf` – the location of your custom php.ini file

You can now use the `up` command:

```
docker-compose up
```



### phpMyAdmin

You can also visit `http://127.0.0.1:81` to access phpMyAdmin after starting the containers.

The default username is `root`, and the password,port is the same as supplied in the `.env` file.



### Adminer

You can also visit `http://127.0.0.1:82` to access Adminer after starting the containers.

The default username is `root`, and the password,port is the same as supplied in the `.env` file.