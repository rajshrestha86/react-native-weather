import React from 'react';
import { Container, Root} from 'native-base';
import { Font, AppLoading } from "expo";
import Roboto from "native-base/Fonts/Roboto.ttf";
import Roboto_medium from "native-base/Fonts/Roboto_medium.ttf";
import ChildApp from "./ChildApp";

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Font.loadAsync({ Roboto, Roboto_medium });
    this.setState({ loading: false });
  }
  
  render() {
    if (this.state.loading) {
      return (
        <Container>
          <AppLoading />
        </Container>
      );
    }

    return (
      <Root>
        <Container>
          <ChildApp />
        </Container>
      </Root>
    );
  }
  
}