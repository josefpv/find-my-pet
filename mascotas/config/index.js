const Cloud = require("@google-cloud/storage");
const path = require("path");
//const serviceKey = path.join(__dirname, "./keys.json");

const { Storage } = Cloud;
const storage = new Storage({
  credentials: {
    type: process.env.TYPE,
    project_id: process.env.BUCKET_PROJECT_ID,
    private_key_id: process.env.BUCKET_KEY_ID,
    private_key: process.env.BUCKET_CRED?.replace(/\\n/gm, "\n"),
    client_email: process.env.BUCKET_CLIENT_EMAIL,
    client_id: process.env.BUCKET_CLIENT_ID,
    auth_uri: process.env.BUCKET_AUTH_URI,
    token_uri: process.env.BUCKET_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.BUCKET_AUTH_PROVIDER,
    client_x509_cert_url: process.env.BUCKET_CLIENT_CERT_URL,
    universe_domain: process.env.BUCKET_UNIVERSE_DOMAIN,
  },
  projectId: "findmypet-387512",
});

module.exports = storage;
