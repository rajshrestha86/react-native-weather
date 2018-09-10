import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text
} from "native-base";

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ip: "Getting your IP and Location. Please wait.....",
      country: "",
      city: "",
      countryCode: "",
      weather: "",
      weather_description: "",
      temperature: "",
      image_url: ""
    };
    this.getIPInfo();
  }


  componentDidMount() {
    // navigator.geolocation.getCurrentPosition((postion)=>{
    //   console.log('wokeeey');
    //   console.log(postion);
    //   this.setState({
    //     latitude: postion.coords.latitude,
    //     longitude: position.coords.longitude
    //   });
    // }, (error)=>{
    //   console.log("error occured");
    // })
  }

  async getIPInfo() {
    const result = {
      ip: "",
      country: "",
      city: "",
      weather: "",
      latitude: "",
      longitude: ""
    };
    const response = await fetch("https://mrktng.zenmate.com/ip");
    const res = await response.json();
    this.setState({
      ip: res.query,
      country: res.country,
      city: res.city,
      countryCode: res.countryCode
    });

    const API_KEY = "c8f81770c04fd624e4dbe14a751939e6";
    const ROOT_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;
    const url = `${ROOT_URL}&q=${this.state.city}`;

    const request = await fetch(url);
    const weather_request = await request.json();
    console.log(weather_request.weather[0].main);
    // const weather_request=await request.data.json();
    this.setState({
      weather: weather_request.weather[0].main,
      weather_description: weather_request.weather[0].description,
      temperature:
        "Temperature: " +
        (weather_request.main.temp - 273.15) +
        " degrees celsius"
    });

    console.log(res);

    // this.setState({ip: await response.json().as});
  }


  render() {
    return (
     <Container>
        <View style={styles.container}>
          {/* <img src={this.state.image_url} /> */}
          <Text />
          <Text>{this.state.ip}</Text>
          <Text>
            {this.state.city}, {this.state.country}{" "}
          </Text>

          <Text>
            {this.state.weather}, {this.state.weather_description}
          </Text>
          <Text>{this.state.temperature}</Text>
        </View>
      </Container>

      <Header />

      <Footer>
        <FooterTab>
            <Button vertical>
              <Icon name="apps" />
              <Text>Apps</Text>
            </Button>
            <Button vertical>
              <Icon name="camera" />
              <Text>Camera</Text>
            </Button>
            <Button vertical active>
              <Icon active name="navigate" />
              <Text>Navigate</Text>
            </Button>
            <Button vertical>
              <Icon name="person" />
              <Text>Contact</Text>
            </Button>
          </FooterTab>


        </Footer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
