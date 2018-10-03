# Docker for Jenkins

## jenkins build docker image

Update docker's service file to allow jenkins read `docker.sock`

After the installation of Jenkins and Docker. Add jenkins user to docker;s group

```bash
sudo gpasswd -a jenkins docker
```

Edit the following file `docker's service`

```bash
nano /lib/systemd/system/docker.service
```

And edit this rule to expose the API :

```bash
ExecStart=/usr/bin/dockerd -H unix:// -H tcp://localhost:2375
```

Now it's time to reload and restart your Docker daemon

```bash
systemctl daemon-reload
systemctl restart docker
```

Then I restarted jenkins and I was able to perform docker commands as jenkins user in jenkins jobs

```bash
sudo service jenkins restart
```
