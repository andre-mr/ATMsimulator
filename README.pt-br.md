# :moneybag: Simulador de ATM
Um simulador de ATM simples para trabalhar com AWS e Bootstrap.

<!-- LINK PUBLICADO -->
:link: [Abra o projeto hospedado no AWS Amplify](https://atm.andremr.dev/)

<!-- SOBRE -->
## :page_with_curl: Sobre o projeto
Este projeto foi feito para fazer uso de Bootstrap e alguns serviços da Amazon, conforme listado abaixo.

### :construction: Feito com
* [HTML] (https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS] (https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Javascript] (https://developer.mozilla.org/en/JavaScript)
* [Bootstrap] (https://getbootstrap.com)
* [AWS Amplify] (https://aws.amazon.com/amplify)
* [AWS API Gateway] (https://aws.amazon.com/api-gateway)
* [AWS Lambda] (https://aws.amazon.com/lambda)
* [AWS DynamoDB] (https://aws.amazon.com/dynamodb)
* [AWS IAM] (https://aws.amazon.com/iam)

<!-- USO -->
## :desktop_computer: Uso básico
Essas são informações básicas de uso para a perspectiva de um cliente de banco.
* O simulador oferece 5 recursos:
  * Saldo da conta
  * Extrato da conta
  * Transferência entre contas
  * Retirada de dinheiro
  * Depósito em dinheiro
* Para fins de simulação, o banco de dados possui 2 contas:
  * Conta: 1001; Senha: account1001; Nome: Fulano de Tal
  * Conta: 1002; Senha: account1002; Nome: Beltrano de Tal
* Os campos de entrada podem ser alterados com o mouse ou a tecla Enter

<!-- NOTAS PARA DESENVOLVEDORES -->
## :keyboard: Notas para desenvolvedores
#### :man_technologist: AWS
O script chama uma API do API Gateway. A API usa modelos para validar o formato da solicitação e, em seguida, passa a solicitação para uma função Lambda sem servidor. A função usa SDK e consome uma tabela DynamoDB, criando uma resposta com resultados de dados ou uma mensagem de erro para o usuário.
#### :man_technologist: Bootstrap
Meu último projeto foi feito com HTML/CSS/JS puro. Desta vez, decidi consumir Bootstrap para fins de aprendizagem.
#### :iphone: Responsividade
Fiz a capacidade de resposta básica para caber em um monitor widescreen padrão e um telefone orientado para retrato.
#### :earth_americas: Idioma
Por enquanto, a interface do usuário está toda em português do Brasil. Por outro lado, todo o código está em inglês.

<!-- CONSIDERAÇÕES FINAIS -->
## Considerações finais
Aprender pra mim é sempre melhor fazendo alguma coisa. Este projeto tem como objetivo ajudar no aprendizado de AWS e Bootstrap.
