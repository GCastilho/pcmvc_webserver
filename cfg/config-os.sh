# cfg/config-os.sh

# Adiciona o usuário webserver com diretório home (para as configs do snap)
# com capacidade de login (para realizar as configurações a seguir) (por questões de segurança)
useradd -m -U webserver

# Desabilita o login remoto para o webserver (trava o password)
passwd -l webserver

#gera uma chave ssh (RSA) para autenticação do webserver com o repositório git
runuser -l webserver -c 'ssh-keygen -b 4096'

# Abre a porta 80 e 443 do firewall (http/https)
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# Redireciona a porta 80 para a porta interna 8000, que é a que o webserver roda
firewall-cmd --zone=public --add-forward-port=port=80:proto=tcp:toport=8000 --permanent
