스파르타 코딩클럽 웹개발 종합반

# ec2 한방에 세팅하기
#### python3 -> python
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3 10

#### pip3 -> pip
sudo apt-get update  
sudo apt-get install -y python3-pip  
sudo update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1  

#### port forwarding
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 5000

#### 강제 종료하기
ps -ef | grep 'python app.py' | awk '{print $2}' | xargs kill
