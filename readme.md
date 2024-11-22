# Calculadora de Distância

Este projeto é uma aplicação mobile desenvolvida em **React Native** que permite ao usuário calcular a distância entre sua localização atual e um endereço informado via CEP. A aplicação também armazena os cálculos em um banco de dados para consulta futura, possibilitando o gerenciamento de históricos de buscas.

---

## Funcionalidades

- **Obter Localização Atual**: A aplicação solicita permissões e captura a localização atual do usuário.
- **Calcular Distância**: Com base em um CEP informado, calcula a distância entre a localização do usuário e o endereço correspondente ao CEP.
- **Exibição no Mapa**: Mostra no mapa a localização atual do usuário e o endereço do CEP buscado.
- **Armazenar no Banco de Dados**: Salva os cálculos (CEP, endereço, distância e localização atual) em um banco de dados MongoDB.
- **Consultar Histórico**: Exibe um histórico das pesquisas realizadas anteriormente.

---

## Tecnologias Utilizadas

### Frontend
- **[React Native](https://reactnative.dev/)**: Framework para o desenvolvimento mobile.
- **[Expo](https://expo.dev/)**: Plataforma para construção, execução e distribuição de apps React Native.
- **[React Navigation](https://reactnavigation.org/)**: Gerenciamento de navegação no app.
- **[Axios](https://axios-http.com/)**: Biblioteca para realizar requisições HTTP.
- **[Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)**: Biblioteca para acesso à localização do dispositivo.
- **[React Native Maps](https://github.com/react-native-maps/react-native-maps)**: Exibição de mapas interativos e marcadores.

### Backend
- **[Node.js](https://nodejs.org/)**: Plataforma para execução de JavaScript no servidor.
- **[Express.js](https://expressjs.com/)**: Framework web minimalista para Node.js.
- **[MongoDB](https://www.mongodb.com/)**: Banco de dados NoSQL utilizado para armazenar os cálculos.
- **[Mongoose](https://mongoosejs.com/)**: ODM para MongoDB, facilitando a manipulação dos dados no backend.