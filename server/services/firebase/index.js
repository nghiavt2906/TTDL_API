import Logger from "lib/logger"
import * as admin from "firebase-admin"
// import serviceAccount from "./service_account_key.json"

const serviceAccount ={
  "type": "service_account",
  "project_id": "enmoapp",
  "private_key_id": "adbc6746070686b9fddd860432ef80043845b7f5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDSHckLJ62co6qT\nCOe86SohNE9LfHRyOp1GUVD3wVE9f8WSsHTH9J+L3lxrjnOk9JBtt/Y9LY6HIzsv\nPgZWgEF7eN3o4LTrTH+rjEc0HeoT7FtfuWFY0tvR3yjKBXdVnsiLJ0/359MX6s9M\nwgL9RLM6mTQMauGF0P20oUnFnHmfQ884ONqKGMSVyRZIdQNN1WQ+L5pIs+9DMtOm\n47F4/SYxBVDxdwSbobwaj+kotb5/7dN4LhwJRSoAlwNY5MI/ey+Cq0ieKSG7PUez\nkJOSEKjS/dY/HYaUQZG8PV5o8uzGfN5hcT/kzBQXPn53VHUOUJfljSijmze60Vto\nvg75+tI/AgMBAAECggEAXn2vmlkjLcS6onoIQT/4Rstv94oGEhLDBMrv5yNkZgxO\nbSv2sK+VioCavnHnFuE3DGiFD7krliFlbdbuYbs295CA90gKhKC3741bvhfP21rZ\nMsC7Awd8fLLndIalxnbsSAwLXfi+yUw7IpFDZ+Ob2HfqXMU6G4RDfBZmhzxZw6GZ\nMZK+upeqS5tB1kiGKLgYnpT+0VR7UC1OGQnbAJtvhBu1pzzWWxDSIiZh+1u0Atvv\nO7yAGl4C+cxI/zeym6wI9nEh66DSwM/wFdi5bPVKgZGkj2CvQ0eNuwYPxTM2NrxK\n73N4Lnr+L8fexAqT6pvnHUPYk/GowVLMyg5LII2LXQKBgQD8uEDFFgZ2z93zUy4L\nK137y8Ou8WyDTyOCmVbOZVzwP3U0hmJ92iGkf6AXszbC4PuyGfviddtjOiBEtjJ1\nhroaTn4Nsj1hgzGbLJazdTSXu2dJIGtNqeFU+kYOu9DmUpk0ftJ115Sx+yBsdOVO\nzXGGOhLdUR4//bMAQYtSnNqw+wKBgQDU1/fWhRsVAMQgwGJ4SEiI+YcmpqC/d+48\n2brNGwf+vSvFjKbiwDRg31biyRtBRznKIMQtn/1XTMqi7mphb0uB0aMF52brllcA\nF+i2uNivERkqs8k2jr1TZs2kQkgNtL1Jf4sj5pRHfBOFTgNSLV0xbLQxSrq8qALO\npyf9UuaIjQKBgQCrLoNw/IJUaGkHMQi3OCDpNhTOo2nFaA29oPBTzgUuF03kzkJY\nzTCMpIZkh1hImOzkrwUXWI3KoMzKvj9frGrS9ugbjuhU7PDlE0bhODrvrFlCB1un\nt7KSRRS/VikiWkC8dktI10Y5aMmFrYjF4BNNwHiWwSOkZMyjF8Kvqt/XkQKBgQDO\nyI+xa5n3GspxI1fHkjpeUUb7xxEPU/4yQjpZAHURCUqYX+DXFXMN1o38QPPoxMEh\nXhoaVYB1K1cHWmgiB1WtZzViDAISyfn2TkQ6GXXzB8KSmR7YkW7gs1UAy6BjKIBq\nAq70jxTqKmJwtW1GjmonFXwvE3I+zWAE06NnWv48FQKBgQDZJKi2flUNkuUlXxBg\nRpn0k9QwCyt1Put1p5q2pE8ocDOPKPcEsQ/K2O+nBV8gAoWZA8ruDpjAeEL+Tmih\nyrfDR/Ks9ZeRhKxvKoHEFpNs+Vfayv+wucT5PvDrw+4oH7pwAcPNKytWx2RmwPtN\nzxyw40bGkVViVpcMRsB6S93r+A==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-7qgvp@enmoapp.iam.gserviceaccount.com",
  "client_id": "104112053198469345886",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7qgvp%40enmoapp.iam.gserviceaccount.com"
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://enmoapp.firebase.com",
})

export default admin
