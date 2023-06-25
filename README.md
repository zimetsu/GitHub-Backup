# github-backup
Schedule cron jobs to backup your repositories.

![screenshot](https://user-images.githubusercontent.com/12623921/230470196-450f9a28-3ebd-47c5-9b6b-b032477db367.png)

# Setup
1. Run the following commands.
```
$ git clone git@github.com:akashaviator/github-backup.git
$ cd github-backup
$ docker-compose up
```


2. Access the app at `http://localhost:3000`.

3. Enter the github repository to backup in the `Repository URL` field. Select the frequency of the backup.
----

Backups are downloaded to the `backups` folder at the root of the project.
