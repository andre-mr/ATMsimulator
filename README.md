# :moneybag: ATM Simulator
A simple ATM simulator to work with AWS and Bootstrap.

<!-- PUBLISHED LINK -->
:link: [Open project hosted in AWS Amplify](https://main.d1cl7ueaoakjqp.amplifyapp.com/)

<!-- ABOUT -->
## :page_with_curl:	About the project
This project was made to make use of some Amazon services, and Bootstrap, as listed below.

### :construction:	Built with
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Javascript](https://developer.mozilla.org/en/JavaScript)
* [Bootstrap](https://getbootstrap.com)
* [AWS Amplify](https://aws.amazon.com/amplify)
* [AWS API Gateway](https://aws.amazon.com/api-gateway)
* [AWS Lambda](https://aws.amazon.com/lambda)
* [AWS DynamoDB](https://aws.amazon.com/dynamodb)
* [AWS IAM](https://aws.amazon.com/iam)

<!-- USAGE -->
## :desktop_computer:	Basic usage
These are basic usage information for a bank customer's perspective.
* The simulator offers 5 features:
  * Account balance
  * Account statement
  * Transfer between accounts
  * Cash withdrawal
  * Cash deposit
* For simulation purposes, database has 2 accounts:
  * Account: 1001; Password: account1001; Name: Fulano de Tal
  * Account: 1002; Password: account1002; Name: Beltrano de Tal
* Input fields can be changed using mouse or enter key

<!-- NOTES FOR DEVELOPERS -->
## :keyboard:	Notes for developers
#### :man_technologist:	AWS
The script calls an API from API Gateway. API uses models to validate request format, then pass the request to a serverless Lambda function. The function uses SDK and consumes a DynamoDB table, creating a response with data results or an error message to user.
#### :man_technologist:	Bootstrap
My last project was made with pure HTML/CSS/JS. This time I decided to consume Bootstrap for learning purposes.
#### :iphone: Responsiveness
I made basic responsiveness to fit a default widescreen monitor and a portrait oriented phone.
#### :earth_americas:	Language
For now, the user interface is all in Brazilian Portuguese. On the other hand, all code is in English.

<!-- FINAL CONSIDERATIONS -->
## Final considerations
Learning for me is always better by making something. This project is intended to help learning AWS and Bootstrap.
