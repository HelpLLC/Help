import React, { Component } from 'react';
import TitleComponent from '../components/TitleComponent';

export default class Credits extends Component {
	render() {
		return (
         <div>
            <TitleComponent text={'Credits'} isCentered={true} backgroundColor={'inherit'} textColor={"#00B0F0"} fontSize={50}/>
            <TitleComponent text={'1) Icons made by "https://www.flaticon.com/authors/smashicons"'} isCentered={false} backgroundColor={'inherit'} fontSize={14} />
            <TitleComponent text={'2) Icons made by "https://www.flaticon.com/authors/kiranshastry"'} isCentered={false} backgroundColor={'inherit'} fontSize={14} />
            <TitleComponent text={'3) Icons made by "https://www.flaticon.com/authors/smalllikeart"'} isCentered={false} backgroundColor={'inherit'} fontSize={14} />
            <TitleComponent text={'4) Icons made by "https://www.flaticon.com/authors/freepik"'} isCentered={false} backgroundColor={'inherit'} fontSize={14} />
         </div>
      );
	}
}
