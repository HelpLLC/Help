//This object contains all of the strings used throughout the entire application.
//Each new defined string must be defined and accessed through this object
export default {
	//------------------- Default Error Message ----------------
	SomethingWentWrong: 'Something went wrong, please try again later',

	//------------------- Tab Bar Navigators -------------------
	Business: 'Business',
	Chats: 'Chats',
	Settings: 'Settings',
	Request: 'Request',

	//-------------------  Splash Screen -------------------
	GetStarted: 'Get Started',
	HaveAnAccountQuestion: 'Have an account?',
	LogIn: 'Log In',
	EYB: 'EYB',
	Help: 'Help',

	//------------------- Log In Screen -------------------
	EnterYourEmail: 'Enter your email...',
	EnterYourPassword: 'Enter your password...',
	IncorrectInfo: 'Incorrect email/password',
	ForgotPassword: 'Forgot Password?',
	ForgotPasswordNoQuestionMark: 'Forgot Password',

	//------------------- Forgot Password Screen -------------------
	ChooseANewPassword: 'Choose a new password...',
	ResetPassword: 'Reset Password',
	EmailMe: 'Email Me!',
	LinkHasBeenEmailed:
		"If a user with this email exists, a link to reset your password has been sent. Please check your spam/junk folders if you don't see the email.",

	//------------------- Create Profile Screen -------------------
	CreateProfile: 'Create Profile',

	//------------------- Account Not Verified Screen -------------------
	AccountNotVerified:
		"Your business has been submitted to the Help staff! Give us up to 24 hours to review your information and then you'll be good to go!",
	Verification: 'Verification',

	//------------------- Sign Up Screen -------------------
	SignUp: 'Sign Up',
	Email: 'Email',
	PhoneNumber: 'Phone Number',
	Address: 'Address',
	EnterAnEmail: 'Enter an email...',
	EnterPhoneNumber: 'Enter your phone number...',
	AccountType: 'Account Type',
	Business: 'Business',
	Password: 'Password',
	ChooseAPassword: 'Choose a password...',
	Customer: 'Customer',
	SignUp: 'Sign Up',
	PleaseFillOutAllFields: 'Please fill out all of the above fields',
	PleaseEnterAValidEmail: 'Please enter a valid email',
	NoButtonSelected: 'Please select an account type',
	EmailExists: 'An account with this email already exists. Go back and log into this account',
	ShortPassword: 'Password must be at least 6 characters',
	IAcceptThe: 'I accept the ',
	TermsAndConditions: 'Terms and Conditions',
	CheckTermsAndConditions: 'You must accept the terms and conditions to use Help',
	BusinessPhoneNumberError: 'All businesses are required to enter their phone numbers',
	InvalidPhoneNumberError: 'Please enter a valid 10 digit phone number',
	BusinessSignUp: 'Business Sign Up',
	Next: 'Next',

	//------------------- Customer Sign Up Screen -------------------
	City: 'City',
	Name: 'Name',
	EnterCityDotDotDot: 'Enter city...',
	AccountSaved: 'Your account has been saved.',
	PleaseEnterName: 'Please enter your name...',
	MyProfile: 'My Profile',

	//------------------- Blocked Businesses Screen -------------------
	Blocked: 'Blocked',
	Unblock: 'Unblock',
	UnblockCompany: 'Unblock Company',
	AreYouSureYouWantToUnblock: 'Are you sure you want to unblock ',
	HasBeenUnblocked: 'has been unblocked.',

	//------------------- Settings Screen -------------------
	History: 'History',
	Privacy: 'Privacy',
	ReportAnIssue: 'Report an Issue',
	Notifications: 'Notifications',
	About: 'About',
	Credits: 'Credits',
	BlockedBusinesses: 'Blocked Businesses',
	LogOut: 'Log Out',

	//------------------- About Screen -------------------
	MarketingMessage: 'Connecting people with service producing businesses',
	PublishedBy: 'Published By',
	HelpLLC: 'Help LLC',
	Contact: 'Contact',
	ContactEmail: 'helpcocontact@gmail.com',

	//------------------- Report Issue Screen -------------------
	WhatSeemsToBeTheProblemQuestion: 'What seems to be the problem?',
	DescribeYourIssueHereDotDotDot: 'Describe your issue here...',
	Report: 'Report',
	ThankYouForReporting: 'Thank you for reporting the problem',
	WellFixItRightAway: "We'll fix it right away",

	//------------------- Create Provider Profile Screen -------------------
	BusinessName: 'Business Name',
	EnterCompanyNameDotDotDot: 'Enter a company name...',
	BusinessDescription: 'Business Description',
	TellYourCustomersAboutYourselfDotDotDot: 'Tell your customers about yourself...',
	PleaseEnterACompanyName: 'Please enter a company name',
	PleaseEnterADescriptionWithAtLeast150Characters:
		'Please enter a description with at least 150 characters',
	PleaseChooseAValidImage: 'Please choose a valid image',
	CompanyNameTakenPleaseChooseAnotherName: 'This company name is taken, please choose another one',

	//------------------- Additional Provider Info Screen -------------------
	Website: 'Website',
	LocationYouServe: 'Location You Serve',
	EnterLocation: 'Enter a location...',
	EnterWebsiteLink: 'Enter a link to your site (Optional)...',
	Ok: 'Ok',
	Location: 'Location',
	WhyWeUseLocation:
		'We collect locations from users to show customers the business that are nearest to them. We never share customer locations without their consent. Our intent is to provide the best customer experience.',

	//------------------- Provider Business Screen -------------------
	EditCompanyProfile: 'Edit Company Profile',
	PlusSign: '+',
	CreateYourFirstProductNowExclamation: 'Create your first product now!',
	Create: 'Create',
	FinishCreatingYourProfile: 'Finish Creating Your Profile',
	FinishCreatingYourProfileMessage:
		"Your business doesn't have all the info customers need! Go complete your profile.",

	//------------------- Create Product Screen -------------------
	CreateService: 'Create Service',
	ServiceTitle: 'Service Title',
	GiveItATitleDotDotDot: 'Give it a title...',
	EditImage: 'Edit Image',
	ServiceDescription: 'Service Description',
	EnterDescriptionForCustomersDotDotDot: 'Enter a little description for customers to see...',
	Pricing: 'Pricing',
	HowMuchWillYouChargeDotDotDot: 'How much will you charge...',
	PleaseCompleteAllTheFields: 'Please complete all the fields',
	PleaseAddAnImage: 'Please add an image',
	Per: 'Per',
	Range: 'Range',
	DollarSign: '$',
	per: 'per',
	Fixed: 'Fixed',
	ProductDeleted: 'This service has been deleted',
	Hour: 'e.g. Hr',
	Min: 'Min',
	Max: 'Max',
	to: 'to',
	PleaseEnterADescriptionWithAtLeast50Characters:
		'Please enter a description with at least 150 characters.',
	DeleteService: 'Delete Service',
	AreYouSureDeleteService:
		'Are you sure you want to delete this service? This action cannot be undone.',

	//------------------- Requester Schedule Screen -------------------
	Schedule: 'Schedule',
	PickADate: 'Pick a Date',
	PickATime: 'Pick a Time',
	FinishRequesting: 'Finish Request',
	AreYouSureYouWantToRequest: 'Are you sure you want to request ',
	isAvailableBetween: 'is available between',
	and: 'and',
	PleaseSelectATimeInWhichTheBusinessIsAvailable:
		'Please select a time in which the business is available.',
	PleaseSelectATimeForYourService: 'Please select a time for your service.',
	AreYouSureYouWantToOverwriteOldRequest:
		'Are you sure you want to overwrite your request for this service?',
	SaveRequest: 'Save Request',
	Save: 'Save',
	TheServiceRequestHasBeenSaved: 'Your request has been saved',
	PleaseSelectADayForYourService: 'Please select a day for your service.',

	//------------------- Create Schedule Screen -------------------
	CreateSchedule: 'Create Schedule',
	AvailableTimesToCompleteService: 'Available Times to Complete Service',
	SpecificDays: 'Specific Days',
	SpecificDaysAndTimes: 'Specific Days & Times',
	SpecificTimes: 'Specific Times',
	Anytime: 'Anytime',
	PleaseSelectATime: 'Please select the times when you are available to complete this service.',
	PleaseSelectDay: 'Please select the days that you are available to complete this service.',
	FromTimeIsMoreThanToTime: "Please select a 'From' time that is less than a 'To' time.",
	ProductCreated: 'The service has been created.',
	ProductUpdated: 'The service has been updated.',

	//------------------- Create Questions Screen -------------------
	InfoFromCustomersQuestion:
		'What information do you need from customers to complete this services?',
	CustomQuestions: 'Custom Questions',
	AddQuestion: 'Add Question',
	Question: 'Question',
	AskQuestionsForCustomers:
		'Ask questions customers would need to answer when they request your product...',
	WhatIsYourEmailAddressQuestion: 'What is your email address?',
	WhatIsYourAddressQuestion: 'What is your address?',
	WhatIsYourPhoneNumberQuestion: 'What is your phone number?',
	EmptyQuestion: 'Please fill out all empty questions before adding another one or clicking next',

	//------------------- Edit Company Profile Screen -------------------
	EditCompany: 'Edit Company',
	EditName: 'Edit Name',
	EditDescription: 'Edit Description',
	Done: 'Done',

	//------------------- Product Screen -------------------
	Service: 'Service',
	EditService: 'Edit Service',
	NoCurrentRequests: 'No Current Requests',
	Cancel: 'Cancel',
	RequestedOn: 'Requested On',
	CurrentRequests: 'Current Requests',

	//------------------- Edit Product Screen -------------------
	EditTitle: 'Edit Title',
	EditDescription: 'Edit Description',
	EditPrice: 'Edit Price',

	//------------------- Add Questions Screen--------------------

	CustomerInfo: 'Customer Info',
	Questions: 'Questions',
	Edit: 'Edit',

	//------------------- Product History Screen -------------------
	ServiceHistory: 'Service History',
	NoHistoryForThisProductYet: 'No history for this product yet',
	CompletedOn: 'Completed On',

	//------------------- Business Side Customer Request Screen -------------------
	CustomerRequest: 'Customer Request',
	Delete: 'Delete',
	Message: 'Message',
	Complete: 'Complete',
	CustomerAnswers: 'Customer Answers',
	ScheduledOn: 'Scheduled on',
	ScheduledAt: 'Scheduled at',
	at: 'at',
	AreYouSureDeleteRequest: 'Are you sure you want to delete this request?',
	DeleteRequest: 'Delete Request',
	RequestDeleted: 'Request Deleted',
	RequestHasBeenDeleted: 'The request has been deleted',
	RequestCompleted: 'Request Completed',
	RequestHasBeenCompleted: 'The request has been completed.',
	CompleteRequest: 'Complete Request',
	AreYouSureCompleteRequest: 'Are you sure you want to complete this request?',

	//------------------- Featured Screen -------------------
	OfferedBy: 'Offered by',
	NoCurrentServices: 'There are no current services available to request. Check back soon!',
	Featured: 'Featured',
	FeaturedServices: 'Featured Services',
	LeaveAReview: 'Leave A Review',
	BusinessName: 'Business Name',
	Submit: 'Submit',
	Skip: 'Skip',
	LeaveAReviewDotDotDot: 'Leave a review...',
	PleaseGiveAStarRatingAlongWithReview: 'Please give a star rating along with your review.',

	//------------------- Categories Screen -------------------
	FeaturedCategories: 'Featured Categories',

	//------------------- Requester Service Screen -------------------
	ServiceRequested: 'Service Requested',
	CancelRequest: 'Cancel Request',
	RequestService: 'Request Service',
	AreYouSureRequestService: 'Are you sure you want to request this service?',
	Yes: 'Yes',
	CompanyServices: 'Company Services',
	MoreByThisBusiness: 'More by this business',
	ReadMore: 'Read More',
	ReadLess: 'Read Less',
	CustomerReviews: 'Customer Reviews',
	ServiceDeleted: 'The business no longer sells this service',
	CompanyBlocked: 'Company Blocked',
	CompanyHasBeenBlocked: 'The company has been blocked',
	ViewRequest: 'View Request',

	//------------------- Requester Answer Questions Screen -------------------
	AnswerHereDotDotDot: 'Answer here...',
	PleaseFillOutAllQuestions: 'Please fill out all of the questions.',
	TheServiceHasBeenRequested: 'The service has been requested',

	//------------------- Requester Order History Screen -------------------
	OrderHistory: 'Order History',
	InProgress: 'In Progress',
	Completed: 'Completed',
	NoRequestsYet: "You haven't requested anything yet! Go check out our services by going to Home",

	//------------------- Requester Requested Service Screen -------------------
	RequestHasBeenCancelled: 'Your request has been cancelled',
	AreYouSureCancelRequest: 'Are you sure you want to cancel your request for this service?',
	OrderAgain: 'Order Again',

	//----------------------- Requester Side Menu -----------------------------------

	Home: 'Home',
	Chats: 'Chats',
	Settings: 'Settings',
	LogOut: 'Log Out',
	Credits: 'Credits',
	Categories: 'Categories',

	//------------------- Requester Side Company Profile Screen -------------------
	CompanyProfile: 'Company Profile',
	Block: 'Block',
	CompanyReported: 'Company Reported',
	AreYouSureYouWantToBlock: 'Are you sure your want to block',
	CompanyHasBeenReported:
		'This company has been reported. Help staff will take a look. Thank you for your patience.',

	//------------------- Chats Screen -------------------
	NoMessagesYet: 'No messages yet',
	Today: 'Today',

	//------------------- Notifications -------------------
	NewRequest: 'New Request',
	YouHaveNewRequestFor: 'You have a new request for ',
	YourRequestFor: 'Your request for',
	HasBeenRemovedBecause: 'has been removed because',
	RequestRemoved: 'Request Removed',
	NoLongerSellsThisService: 'no longer sells this service.',
	RequestCancelled: 'Request Cancelled',
	HasCancelledTheirRequestFor: 'has cancelled their request for',
	HasUpdatedTheirRequestFor: 'has updated their request for',
	RequestUpdated: 'Request Updated',

	//------------------- Documents -----------------
	PrivacyPolicy: 'PrivacyPolicy',

	//------------------- Search Bar -------------------
	WhatAreYouLookingForQuestion: 'What are you looking for?',
	SearchIn: 'Search in',
	SearchCategoriesDotDotDot: 'Search categories...',

	//------------------- Image Picker -------------------
	SelectPhoto: 'Select a Photo',
	TakePhotoDotDotDot: 'Take Photo...',
	ChooseFromLibraryDotDotDot: 'Choose from Library...',

	//------------------- Miscellaneous -----------------
	Whoops: 'Whoops',
	DotDotDot: '...',
	Success: 'Success',
	Ok: 'Ok',
	NoConnection: 'Something went wrong. Check your internet connection & try again',
	UpdateAvailable: 'Update Available',
	UpdatingAppDotDotDot: 'Updating Help...',
	LoadingAppDotDotDot: 'Loading Help...',
	UpdateAvailableMessage: 'There is a new update available for Help! Go download it now!',
	Restart: 'Restart',
	AppWillRestart: 'Help will now restart to install the update.'
};
