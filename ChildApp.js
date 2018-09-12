import React from 'react';
import { StyleSheet,  View, StatusBar, Image } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, InputGroup, Input, Button, Icon, Text, Spinner, Item} from 'native-base';
import { SearchBar } from 'react-native-elements';
import {LinearGradient} from 'expo';
import {icons} from './config';
import FooterTheme from './native-base-theme/components/Footer';
import material from './native-base-theme/variables/platform';

export default class ChildApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      home: {
        WeatherLoading: true,
        error: false,
        Location: '',
        Weather: '',
        WeatherDescription: '',
        WeatherIcon: '',
        Country: '',
        Temp: '',
        Pressure: '',
        Humidity:'',
        TempMin:'',
        TempMax: '',
      },

      search: {
        WeatherLoading: true,
        error: false,
        Location: '',
        Weather: '',
        WeatherDescription: '',
        WeatherIcon: '',
        Country: '',
        Temp: '',
        Pressure: '',
        Humidity:'',
        TempMin:'',
        TempMax: '',
      },
     
      selectedTab: "home",
      searchText: '',
      searchButtonClicked:'',      
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
    try{
      const request = await fetch(url);
      const weather_request = await request.json();
      if(weather_request.cod==200)
    this.setState({
      home:{
        WeatherLoading: false,
        Location: weather_request.name,
        Weather: weather_request.weather[0].main,
        WeatherDescription: weather_request.weather[0].description,
        WeatherIcon: this.getIcon(weather_request.weather[0].icon),
        Country: weather_request.sys.country,
        Temp: (weather_request.main.temp - 273).toFixed(2),
        Pressure: weather_request.main.pressure,
        Humidity: weather_request.main.humidity,
        TempMin: (weather_request.main.temp_min-273).toFixed(2),
        TempMax: (weather_request.main.temp_max-273).toFixed(2),
      }
    });
    } catch(error){
      this.setState({home: {WeatherLoading: false, error: true}})
    }
       
  }

  getIcon(code){
    switch(code){
      case '01d':
        return icons.clear_day;
        break;
      case '01n':
        return icons.clear_night;
        break;
      case '02d':
        return icons.few_clouds_day;
        break;
      case '02d':
        return icons.few_clouds_night;
        break;  
      case '03d':
        return icons.scattered_clouds_day;
        break;
      case '03n':
        return icons.scattered_clouds_night;
        break;
      case '04d':
        return icons.broken_clouds_day;
        break;
      case '04n':
        return icons.broken_clouds_night;
        break;
      case '09d':
        return icons.shower_rain_day;
        break;
      case '09n':
        return icons.shower_rain_night;
        break;
      case '10d':
        return icons.rain_day;
        break;
      case '10n':
        return icons.rain_night;
        break;
      case '11d':
        return icons.thunderstorm_day;
        break;
      case '11n':
        return icons.thunderstorm_night;
        break;
      case '13d':
        return icons.snow_day;
        break;
      case '13n':
        return icons.snow_night;
        break;
      case '50d':
        return icons.mist_day;
        break;
      case '50n':
        return icons.mist_night;
        break;  
    }
  }


  renderSelectedTab(){
      switch(this.state.selectedTab){
          
        case 'home': // Search and Display the weather
            return this.displayHomeWeatherTab();
            break;
          case 'search':
            return this.searchWeatherTab();

      }
  }


  displayHomeWeatherTab(){

    return(
            <View style={styles.container}>
            
            {this.renderLoadingSpinner(this.state.home.WeatherLoading)}
            
            {this.displayWeather(this.state.home)}

            </View>   
            
            
    );
  }


  searchWeatherTab(){
    return(
       <View style={styles.container}> 
      <InputGroup  style={{marginTop: 5, padding: 10, alignItems: "baseline"}}>
                      <Item regular>
                      <Input  small placeholder='Type city Name to Search' onChangeText={(text)=>this.setState({searchText: text})}/>
                      
                      <Button iconLeft dark onPress={()=>{
                                             this.setState({searchButtonClicked: true})
                                             this.setState({search: {WeatherLoading: true}})
                                             this.searchWeatherFunction(this.state.searchText)}} > 
                          <Icon name="search" />
                          <Text>Search</Text>
                      </Button>
                      </Item>
      </InputGroup>
      {this.renderSearchResults()}
      </View>
      

          );
}

  displayWeather(data){
    
    // const icon=`./icons/${this.state.homeWeatherIcon}`;
    console.log(data)
    if(data.WeatherLoading==false && data.error==false)
      return (
        <View>
          <View style={styles.locationContainer} >
            <Icon name="md-pin" style={{ marginBottom: 5 }} />
            <Text style={{ fontSize: 20, padding: 5 }}>
              {data.Location}, {data.Country}
            </Text>
          </View>





          <View >

            <Image source={data.WeatherIcon} style={{ alignSelf: 'center' }} />


            <Text style={{ fontSize: 55, fontWeight: "bold", marginTop: 10, marginLeft: 5 }}>{data.Temp}° C</Text>

            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 5 }}>
              {data.Weather}, {data.WeatherDescription}
            </Text>


            <View style={styles.additionalForcast}>
              <View style={styles.forecast}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Pressure</Text>
                <Text style={{ fontSize: 18 }}>{(data.Pressure / 760).toFixed(2)} atm</Text>


              </View>


              <View style={styles.forecast}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}> Humidity</Text>
                <Text style={{ fontSize: 18 }}>{data.Humidity}</Text>


              </View>


              <View style={styles.forecast}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}> Min/Max</Text>
                <Text style={{ fontSize: 18 }}>{data.TempMin}° C, {data.TempMax}° C  </Text>


              </View>

            </View>
          </View>
        </View>
      );
        else if(data.error==true){
          return(
            <View>
            <Text style={{color: "red"}}>Error connecting to Server please check your network connection or Try again later.</Text>


            </View>

          );

    }
  
  }




  async searchWeatherFunction(location){
    const API_KEY = "c8f81770c04fd624e4dbe14a751939e6";
    const ROOT_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;
    const url = `${ROOT_URL}&q=${location}`;


    try{
    const request = await fetch(url);
    const weather_request = await request.json();
    
    if(weather_request.cod==200)
    this.setState({
      search:{
        WeatherLoading: false,
        Location: weather_request.name,
        Weather: weather_request.weather[0].main,
        WeatherDescription: weather_request.weather[0].description,
        WeatherIcon: this.getIcon(weather_request.weather[0].icon),
        Country: weather_request.sys.country,
        Temp: (weather_request.main.temp - 273).toFixed(2),
        Pressure: weather_request.main.pressure,
        Humidity: weather_request.main.humidity,
        TempMin: (weather_request.main.temp_min-273).toFixed(2),
        TempMax: (weather_request.main.temp_max-273).toFixed(2),
      },
      searchButtonClicked: false
    });
  } catch(error)  {
      this.setState({search: {WeatherLoading: false, error: true}, searchButtonClicked: false})
    
  }

  }


  renderSearchResults(){

    return(

    <View>
           
            {this.renderSearchingSpinner()}
            {this.displayWeather(this.state.search)}

      </View>   

    );

   
  }


  renderLoadingSpinner(stats){
    if(stats)
      return <Spinner style={{alignSelf: "center"}}/>
  }

  renderSearchingSpinner(){
    if(this.state.searchButtonClicked && this.state.search.WeatherLoading)
      return <Spinner style={{alignSelf: "center"}}/>
  }


  render() {
    return (
      
        
        <Container style={styles.container}>
 
        

        {this.renderSelectedTab()}

        

        
          

        <Footer style={{backgroundColor: '#fff'}}>
        <FooterTab style={{backgroundColor: '#fff'}}>
            <Button vertical light active={this.state.selectedTab=="home"} onPress={()=>this.setState({selectedTab: "home"})}>
            
            <Icon name="md-pin" />
            <Text>Home</Text>
          
            </Button>
            <Button vertical  light active={this.state.selectedTab=="search"} onPress={()=>this.setState({selectedTab: "search"})} >
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

  locationContainer: {
    flexDirection: "row",
    marginTop: 10, 
    alignSelf: "flex-start",
    marginLeft: 5,

  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#ffffff',
    // alignItems: 'center',
      
  },

  additionalForcast: {
    flexDirection: "row",
    marginTop: 10, 
    justifyContent: 'center',
    alignItems: 'center',

  },

  forecast: {
    alignItems: 'center',
    padding: 20,
  }
});



