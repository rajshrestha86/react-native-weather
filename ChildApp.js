import React from 'react';
import { StyleSheet,  View, StatusBar } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, InputGroup, Input, Button, Icon, Text, Spinner} from 'native-base';
import { SearchBar } from 'react-native-elements';
import {LinearGradient} from 'expo';

export default class ChildApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      homeWeatherLoading: true,
      homeLocation: '',
      homeWeather: '',
      homeWeatherDescription: '',
      homeCountry: '',
      homeTemp: '',
      homePressure: '',
      homeHumidity:'',
      homeTempMin:'',
      homeTempMax: '',
      searchLocation: '',
      searchWeather: '',
      searchWeatherDescription: '',
      searchCountry: '',
      searchTemp:'',
      searchPressure: '',
      searchHumidity: '',
      searchTempMin: '',
      searchTempMax: '',

      selectedTab: "home",
      searchText: '',
      searchComplete: false,
      ip: "Getting your Location and Weather. Please wait.....",
      country: "",
      city: "",
      countryCode: "",
      weather: "",
      weather_description: "",
      temperature: "",
      pressure: '',
      humidity: '',
      temp_min: '',
      temp_max: '',
      image_url: "",
      cod: ''
    };
    this.getHomeWeather();
  }

  async getHomeWeather() {
    // Instead of Using GPS we are trying to get the user's location via their IP
    const result = {
      ip: "",
      country: "",
      city: "",
      weather: "",
      latitude: "",
      longitude: ""
    };

    let get_ip_res;
    try {
      const response =  await fetch("https://mrktng.zenmate.com/ip");
      get_ip_res = await response.json();
    } catch(error) {
      console.log(error);
      return;
    }
    
    console.log(get_ip_res);
    this.setState({
      ip: '',
      country: get_ip_res.country,
      homeLocation: get_ip_res.city,
      countryCode: get_ip_res.countryCode
    });


    // After finding the homeLoacation fetching the weather of homelocation using openweather API.
    const API_KEY = "c8f81770c04fd624e4dbe14a751939e6";
    const ROOT_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;
    const url = `${ROOT_URL}&q=${this.state.homeLocation}`;

    const request = await fetch(url);
    const weather_request = await request.json();
    if(weather_request.cod==200)
    this.setState({
      homeWeatherLoading: false,
      homeLocation: weather_request.name,
      homeWeather: weather_request.weather[0].main,
      homeWeatherDescription: weather_request.weather[0].description,
      homeCountry: weather_request.sys.country,
      homeTemp: (weather_request.main.temp - 273).toFixed(2),
      homePressure: weather_request.main.pressure,
      homeHumidity: weather_request.main.humidity,
      homeTempMin: (weather_request.main.temp_min-273).toFixed(2),
      homeTempMax: (weather_request.main.temp_max-273).toFixed(2),
    });   
  }


  renderSelectedTab(){
      switch(this.state.selectedTab){
          
        case 'home': // Search and Display the weather
            return this.displayHomeWeather();
            break;
          case 'search':
            return this.searchWeatherTab();

      }
  }


  displayHomeWeather(){

    return(
            <View style={styles.container}>
            
            {this.renderHomeLoadingSpinner()}
            
            {this.displayWeather()}

            </View>   
            
            
    );
  }



  displayWeather(data){
    return(
    <View>
      <View style={{flexDirection: "row", margin: 5}} >
        <Icon name="md-pin" style={{marginBottom: 5}}/>
        <Text style={{fontSize: 20, padding: 5}}>
      {this.state.homeLocation}, {this.state.homeCountry}{" "}
      </Text>
  </View>
  <Text>{this.state.ip}</Text>
  

  <Text>
      {this.state.homeWeather}, {this.state.homeWeatherDescription}
  </Text>
  <Text>{this.state.homeTemp}</Text>
  </View>
    )  }


  displaySearchWeather(){
    return(

      <View>
      <Text />
      <Text>
          {this.state.searchLocation}, {this.state.searchCountry}{" "}
      </Text>

      <Text>
          {this.state.searchWeather}, {this.state.searchWeatherDescription}
      </Text>
      <Text>{this.state.searchTemp}</Text>
      </View>            
);
  }


  searchWeatherTab(){
      return(
         <Content> 
        <InputGroup borderType='regular' >
                        <Input placeholder='Type your text here' onChangeText={(text)=>this.setState({searchText: text})}/>
                        <Button onPress={()=>{
                                                
                                                this.searchWeatherFunction(this.state.searchText)}}> 
                            <Text>Click Me! </Text>
                        </Button>
        </InputGroup>
        <Text>{this.state.searchText}</Text>

        {this.renderSearchResults()}
        </Content>
        

            );
  }


  async searchWeatherFunction(location){
    const API_KEY = "c8f81770c04fd624e4dbe14a751939e6";
    const ROOT_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;
    const url = `${ROOT_URL}&q=${location}`;

    const request = await fetch(url);
    const weather_request = await request.json();
    console.log(weather_request.weather[0].main);
    // const weather_request=await request.data.json();
    this.setState({searchComplete: true});
    if(weather_request.cod==200)
    this.setState({
      searchLocation: weather_request.name,
      searchWeather: weather_request.weather[0].main,
      searchWeatherDescription: weather_request.weather[0].description,
      searchCountry: weather_request.sys.country,
      searchTemp: (weather_request.main.temp - 273).toFixed(2),
      searchPressure: weather_request.main.pressure,
      searchHumidity: weather_request.main.humidity,
      searchTempMin: (weather_request.main.temp_min-273).toFixed(2),
      searchTempMax: (weather_request.main.temp_max-273).toFixed(2),
    });  

  }


  renderSearchResults(){
    if(this.state.searchComplete){
        return this.displaySearchWeather();
    }
  }


  renderHomeLoadingSpinner(){
    if(this.state.homeWeatherLoading)
      return <Spinner />
  }


  render() {
    return (
      
        
        <Container style={styles.container}>
        <StatusBar 
          backgroundColor="blue"  
          barStyle="light-content" />
        

        {this.renderSelectedTab()}

        
          

        <Footer>
        <FooterTab>
            <Button vertical active={this.state.selectedTab=="home"} onPress={()=>this.setState({selectedTab: "home"})}>
            
            <Icon name="home" />
            <Text>Home</Text>
          
            </Button>
            <Button vertical active={this.state.selectedTab=="search"} onPress={()=>this.setState({selectedTab: "search"})} >
            <Icon name="search" />
            <Text>Search</Text>
            </Button>
        </FooterTab>
        </Footer>  
        </Container> 
 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#acacac',
    justifyContent: 'flex-start',
  },
});



