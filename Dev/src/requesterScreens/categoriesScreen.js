//This screen will display the list of categories in a two column display by leveraging the categoriesList
//component
import React, { Component } from 'react';
import SideMenu from 'react-native-side-menu';
import CategoriesList from '../components/CategoriesList';
import { View, Text, Dimensions } from 'react-native';
import HelpView from '../components/HelpView';
import LoadingSpinner from '../components/LoadingSpinner';
import screenStyle from 'config/styles/screenStyle';
import TopBanner from '../components/TopBanner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import LeftMenu from './LeftMenu';
import fontStyles from 'config/styles/fontStyles';
import HelpSearchBar from '../components/HelpSearchBar';
import colors from 'config/colors';

export default class categoriesScreen extends Component {
  //The state controlling the Loading of this screen
  state = {
    isLoading: true,
    categories: null,
    requester: this.props.navigation.state.params.requester,
    isOpen: false,
    search: ''
  };

  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen('CategoriesScreen', 'categoriesScreen');
    const categories = await FirebaseFunctions.getCategoryObjects();
    this.setState({
      categories,
      isLoading: false
    });
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    } else {

      const { search } = this.state;

      return (
        <SideMenu
          isOpen={this.state.isOpen}
          menu={
            <LeftMenu
              navigation={this.props.navigation}
              allProducts={this.props.navigation.state.params.allProducts}
              requester={this.state.requester}
            />
          }
        >
          <HelpView style={screenStyle.container}>
            <TopBanner
              leftIconName='navicon'
              leftOnPress={() => {
                FirebaseFunctions.analytics.logEvent(
                  'sidemenu_opened_from_categories'
                );
                this.setState({ isOpen: true });
              }}
              size={30}
              title={strings.Categories}
            />
            <HelpSearchBar
              placeholderText={strings.SearchCategoriesDotDotDot}
              value={search}
              onChangeText={(text) => {

                //Logic for searching
                this.setState({ search: text });

              }} />
            <View
              style={{
                height: Dimensions.get('window').height * 0.05,
                width: Dimensions.get('window').width * 0.93,
                justifyContent: 'flex-end',
                alignItems: 'flex-start'
              }}
            >
              <Text style={fontStyles.bigTextStyleBlue}>
                {strings.FeaturedCategories}
              </Text>
            </View>
            <CategoriesList
              categories={this.state.categories}
              requester={this.state.requester}
              allProducts={this.props.navigation.state.params.allProducts}
              navigation={this.props.navigation}
            />
          </HelpView>
        </SideMenu>
      );
    }
  }
}
