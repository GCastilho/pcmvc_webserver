# cfg/config-os.sh

# Adiciona o usuário webserver com diretório home (para as configs do snap)
# com capacidade de login (para realizar as configurações a seguir) (por questões de segurança)
useradd -m -U webserver

# Desabilita o login remoto para o webserver
passwd -l webserver

# Durante a última instalação foi necessário rodar esse comando para corrigir
# "npm WARN lifecycle npm is using /var/lib/snapd/snap/node/2485/bin/node
# but there is no node binary in the current PATH", se esse erro acontecer,
# o comando seguinte irá resolvê-lo
# Nota: O comando deve ser executado com o usuário que irá rodar o serviço
runuser -l webserver -c 'npm config set scripts-prepend-node-path auto'
