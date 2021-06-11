<h1 align="center">
Opensource.builders
</h1>

Opensource.builders is a website to find and request open-source alternatives to popular software you already use.

## 🚀 Quick start

### Local setup

1.  **Clone the site.**

    Use the Gatsby CLI to create a new site, specifying the blog starter.

    ```shell
    # clone this repo
    git clone https://github.com/junaid33/opensource.builders
    ```

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd opensource.builders
    yarn install
    yarn start
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

### Online one-click setup

To edit website online, check out the CodeSandbox:

https://codesandbox.io/s/github/junaid33/opensource.builders

## Want to add a open-source project?

There are 2 ways to add a new open-source project

1. Go to http://localhost:8000/edit. You will see a blue pencil icon on the bottom left. When you click it, it opens TinaCMS. You can add comparisons and alternatives here and change the data on existing ones. Once done, the data is automatically saved and you can send a PR which I can preview and accept quickly.
2. All the data is saved here:

https://github.com/junaid33/opensource.builders/blob/master/content/alts/alts.json

You can edit this JSON directly and send a PR if you don't want to run anything locally.

## Want to add a request for open-source alternatives?

1. Create an issue with the title being the name of the commercial software and the body being a small description
2. Add the label "request" and give it the initial thumbs-up

## What's the tech stack?

1. [TinaCMS](https://github.com/tinacms/tinacms) to add the comparisons and alternatives. They are kept as a JSON file.
2. [ChakraUI](https://github.com/chakra-ui/chakra-ui) to style the website
3. Github issues to handle new requests
