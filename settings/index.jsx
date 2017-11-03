import { APIClientCredentials } from '../common/APIClientCredentials.js'

// Need help ? ;)
// https://dev.fitbit.com/guides/settings/
// https://dev.fitbit.com/reference/settings-api/#oauth-button
function settings(props) {
  return (
    <Page>
      <Section
        title="Account">
        <Text>
          Connect to give this app permission to access to your account.
        </Text>
        <Oauth
          settingsKey="oauth"
          title="Fitbit Login"
          label="Fitbit"
          status="Login"
          authorizeUrl="https://www.fitbit.com/oauth2/authorize"
          requestTokenUrl="https://api.fitbit.com/oauth2/token"
          clientId={APIClientCredentials.clientId}
          clientSecret={APIClientCredentials.clientSecret}
          scope={APIClientCredentials.scope}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settings);
