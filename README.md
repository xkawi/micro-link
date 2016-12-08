### Introduction

`micro-link` is a minimalistic microservice that lets you easily generate and resolve sharable dynamic link (a.k.a deeplink). no database. no fancy architecture. just a microservice powered by [micro](https://github.com/zeit/micro).

### Generating a Dynamic Link

Simply send a POST request to `https://micro-link.now.sh` in this way:

```
POST https://micro-link.now.sh

Request Body:
{
  web: "https://google.com" (required),
  ios: "google://search" (optional),
  android: "google://search" (optional)
}
```

please take note that, the "web" link is required because that will always be the fallback link. You can try using tools like [Postman](https://www.getpostman.com/) or `curl` to make the network request:

`echo '{"web":"google.com"}' | curl -d @- https://micro-link.now.sh`

The response contains a JSON object with the generated dynamic link like this:

```
{
  link: "https://micro-link.now.sh?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWIiOiJodHRwczovL3FhbnZhc3QuY29tIiwiaW9zIjoicWFudmFzdDovL2Rpc2NvdmVyeSIsImlhdCI6MTQ3ODUzMDE3NX0.eQao9zz3sskQTxaOUETQlB-QeYUmHVEqkF8905id-6M"
}
``` 

`micro-link` simply acts as an API for you to generate dynamic links. How you are going to utilize the generated dynamic link is totally up to your needs.

### Resolving a Dynamic Link

Simply make a GET request to the generated dynamic link to resolve it:

```
GET https://micro-link-jzbxhzqoqd.now.sh?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWIiOiJodHRwczovL3FhbnZhc3QuY29tIiwiaW9zIjoicWFudmFzdDovL2Rpc2NvdmVyeSIsImlhdCI6MTQ3ODUzMDE3NX0.eQao9zz3sskQTxaOUETQlB-QeYUmHVEqkF8905id-6M
```

Depending on the browser that you use to resolve the link, `micro-link` will automatically detect the browser's User Agent and redirect to the application or website properly.

Give it a try! Generate a simple dynamic link that resolve to any apps of even your own apps, and open the generated link from your iPhone and Android devices to see it in action.

### Under the Hood

`micro-link` utilizes [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) to generate a unique dynamic link for the payload (request body) received. That means you have to supply a secret to JWT to generate the unique token. This token is then included in the response object that contains the "generated" dynamic link.
This allows `micro-link` to retrieve this token when resolving the dynamic link, and retrieve the payload back for redirection. The redirection is achieved through the use of [useragent](https://github.com/3rd-Eden/useragent) library that detect the client's user agent and pick the correct redirection link from the payload.

### Advance

You can easily deploy `micro-link` as your own dynamic link microservice as well using [Now](https://zeit.co/now) by [Zeit.co](https://twitter.com/zeithq). Follow this steps:

1. `$ git clone https://github.com/xkawi/micro-link.git`
2. `$ cd micro-link`
3. modify the `jwtSecret` and optionally `tokenQueryKey` found at `lib/core.js`
4. `$ npm install -g now` (ensure that you are using node v6 and above)
5. `$ now` (you may need to login if it is your first time)
6. open the copied link in the browser and there you have it! your own dynamic link microservice deployed in less than a minute!

Or just click the icon below to deploy your own microservice to Now:

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/xkawi/micro-link&env=JWT_SECRET)

#### Managing Secrets & Environment Variables

If you look at `lib/core.js`, there are a few environment variables that you can utilize, they are namely:

1. `JWT_SECRET` - to store your JWT secret securely
2. `HOST_URL` - used when generating the dynamic link. It is important that this `HOST_URL` can resolve properly, otherwise the dynamic link will not work. By default it uses the deployed url from Now, NOW_URL, which is automatically provided.
3. `TOKEN_QUERY_KEY` - if you want to customize the query key such as `<HOST_URL>?customKey=<JWT_token>`, you can use this env var to overwrite the default `<HOST_URL>?token=<JWT_token>` key  

Refer to Now's [documentation](https://zeit.co/blog/environment-variables-secrets) in handling secrets and environment variables.

### Roadmap

- show a landing page if the dynamic link cannot be resolved properly on mobile
- handle Android deeplink the "correct" way (as I am not familiar with this)
- shorten the token? open to any discussion if you have some ideas.

### Contributing

If you would like to contribute to any of the roadmap above or simply want to contribute discussions or anything, go to `micro-link` github repo [here](https://github.com/xkawi/micro-link) and fork it, open issues, and of course, don't forget to star it!

Have fun!
