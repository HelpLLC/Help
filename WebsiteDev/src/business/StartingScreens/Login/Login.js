import React from 'react';
import EditText from '../../../components/EditText';
import HelpButton from '../../../components/HelpButton';
import TitleComponent from '../../../components/TitleComponent';
import './Login.css';
import DayText from '../../../components/DayText';
import Modal from 'react-modal';
import * as firebase from 'firebase'

export default function Login() {
	var subtitle;
	const [modalIsOpen,setIsOpen] = React.useState(false);
	function openModal() {
	  setIsOpen(true);
	}
	function closeModal(email){
	  firebase.auth().sendPasswordResetEmail(email);
	  setIsOpen(false);
	}
	
	return (
		<div>
			<section>
				<EditText className='input' labelText='Email' widthPercent={600} />
				<EditText labelText='Password' widthPercent={600} />
				<HelpButton label='Login' />
				<br />
				<br />
				<HelpButton label='Forgot Password' method={(email)=>{ openModal(email); }} />
			</section>

			<Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
			//  style={customStyles}
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			 }}
        >
 
          <TitleComponent text='Forgot Password' textColor='#00B0F0'/>
            <EditText labelText='Email' widthPercent={'100%'} size='small'/>
				<br />
				<HelpButton label='Email Me!' method={()=>{ closeModal(); }} />
        </Modal>
		</div>
	);
}
