# heroImage: Inspirational Photography Collection

heroImage is a web application that showcases a curated collection of inspirational photography, personally selected by documentary photographer Mario Alberto Chávez. This platform serves as both a source of inspiration and a digital archive of impactful imagery.

## About the Project

heroImage is built with Ruby on Rails 8 (beta 1) and deployed using Kamal 2. It aims to celebrate and share remarkable photography, creating a space for reflection, inspiration, and appreciation of diverse voices in the photographic community.

## Features

- Curated collection of inspirational photographs
- Information about photographers, their websites, and specific projects
- Descriptions of featured works
- Non-profit platform dedicated to celebrating photography
- Progressive Web App (PWA) support for mobile installation and offline access
- Responsive design for optimal viewing on various devices

## Technology Stack

- Ruby on Rails 8 (beta 1)
- Deployed with Kamal 2
- SQLite3 as the database
- Importmaps for JavaScript management (no build step required)
- TailwindCSS for styling
- Turbo Rails and Hotwire for enhanced interactivity
- Stimulus for JavaScript behavior
- Service Workers for PWA functionality

## Getting Started

### Prerequisites

- Ruby 3.3.0 or later
- Rails 8 (beta 1)
- SQLite3

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/mariochavez/inspiration.git
   cd inspiration
   ```

2. Run the setup script:

   ```
   bin/setup
   ```

   ```

   ```

3. Start the Rails server:

   ```
   bin/rails server
   ```

4. Visit `http://localhost:3000` in your browser.

#### Seed first user

This application does not inclides seed data. Create your first user by running the following command:

```
bin/rails c
User.create(email: "youremail", password: "yoursecurepassword")
```

Then navigate to `http://localhost:3000/sessions/new` to log in. If you are not taken to admin area navigate to `http://localhost:3000/admin`.
Add your first image and wait for background job to publish it.

## Mobile Installation

heroImage supports Progressive Web App (PWA) functionality, allowing users to install it on their mobile devices for quick access and improved performance:

1. Open the website in a mobile browser (e.g., Chrome on Android or Safari on iOS).
2. For Android: Tap the "Add to Home Screen" prompt or select "Install App" from the browser menu.
3. For iOS: Tap the share button and select "Add to Home Screen".

Once installed, the app can be launched from the home screen like any other mobile application.

## Deployment

This application is deployed using Kamal 2. Refer to the [Kamal documentation](https://kamal-deploy.org/) for detailed deployment instructions.

Create a secrets file at `.kamal/secrets` with the following content:

```

# Secrets defined here are available for reference under registry/password, env/secret, builder/secrets,
# and accessories/*/env/secret in config/deploy.yml. All secrets should be pulled from either
# password manager, ENV, or a file. DO NOT ENTER RAW CREDENTIALS HERE! This file needs to be safe for git.

# Option 1: Read secrets from the environment
KAMAL_REGISTRY_PASSWORD=$KAMAL_REGISTRY_PASSWORD

# Option 2: Read secrets via a command
RAILS_MASTER_KEY=$(cat config/credentials/production.key)

REGISTRY_USERNAME=$REGISTRY_USERNAME
SSH_USER=$SSH_USER
SSH_PORT=$SSH_PORT

# Option 3: Read secrets via kamal secrets helpers
# These will handle logging in and fetching the secrets in as few calls as possible
# There are adapters for 1Password, LastPass + Bitwarden
#
# SECRETS=$(kamal secrets fetch --adapter 1password --account my-account --from MyVault/MyItem KAMAL_REGISTRY_PASSWORD RAILS_MASTER_KEY)
# KAMAL_REGISTRY_PASSWORD=$(kamal secrets extract KAMAL_REGISTRY_PASSWORD $SECRETS)
# RAILS_MASTER_KEY=$(kamal secrets extract RAILS_MASTER_KEY $SECRETS)
```

Ensure to set in your environment all the variables defined in the file. Also, remove the `config/credentials/production.yml.enc` file
and run `bin/rails credentials:edit --environment production` to create a new one.

Modify the `config/deploy.yml` file to set the correct values for the variables defined in the file.

## License

heroImage is released under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributing

As this is a personal project, contributions are not actively sought. However, if you have suggestions or find issues, please feel free to open an issue in the repository.

## Copyright and Usage

All images on this website belong to their respective owners. The website content and code are Copyright © 2024 Mario Alberto Chávez.

If you are a featured photographer and wish to have your work removed from this site, please contact <mario@f64.io>.

## Contact

Mario Alberto Chávez - <mario.chavez@gmail.com>

Project Link: [https://github.com/mariochavez/inspiration](https://github.com/mariochavez/inspiration)

## Acknowledgements

- All photographers whose work is featured on the site
- Ruby on Rails community
- TailwindCSS team
- Hotwire and Stimulus contributors
