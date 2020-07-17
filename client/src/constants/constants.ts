import { FileType, NewsStatus } from '../models/models';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export const States = ['Andaman and Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
    'Chhattisgarh', 'Delhi', 'Daman and Diu', 'Dadra and Nagar Haveli', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Odisha', 'Mizoram', 'Orissa', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamilnadu', 'Telangana', 'Tripura', 'Uttarkhand', 'Uttar Pradesh', 'West Bengal', 'Puducherry'];

export const StatesAndDirstricts = [
    { State: 'Andaman and Nicobar', Districts: ['Port Blair'] },
    {
        State: 'Andhra Pradesh', Districts: ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Kadapa', 'Krishna', 'Kurnool',
            'Prakasam', 'Sri Potti Sriramulu Nellore', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari']
    },
    {
        State: 'Arunachal Pradesh',
        Districts: ['Hawai', 'Changlang', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit',
            'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke-Kessang', 'Papum Pare', 'Shi Yomi',
            'Siang', 'Tawang', 'Tirap', 'Upper Dibang Valley', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang']
    },
    {
        State: 'Assam', Districts: ['Baksa', 'Barpeta', 'Bishwanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji',
            'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan',
            'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'South Salmara',
            'Sonitpur', 'Tinsukia', 'Udalguri', 'West Karbi Anglong']
    },
    {
        State: 'Bihar', Districts: ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga',
            'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura',
            'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura',
            'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran']
    },
    {
        State: 'Chhattisgarh', Districts: ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada',
            'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba',
            'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja']
    },
    { State: 'Goa', Districts: ['North Goa', 'South Goa'] },

    {
        State: 'Gujarat', Districts: ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad',
            'Chhota Udepur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
            'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat',
            'Surendranagar', 'Tapi', 'Vadodara', 'Valsad']
    },

    {
        State: 'Haryana', Districts: ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hissar', 'Jhajjar',
            'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa',
            'Sonipat', 'Yamuna Nagar']
    },

    {
        State: 'Himachal Pradesh', Districts: ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti',
            'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una']
    },

    {
        State: 'Jharkhand', Districts: ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih',
            'Godda', 'Gumla', 'Hazaribag', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi',
            'Sahibganj']
    },

    {
        State: 'Karnataka', Districts: ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajnagar',
            'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri',
            'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi',
            'Uttara Kannada', 'Vijayapura', 'Yadgir']
    },

    {
        State: 'Kerala', Districts: ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode',
            'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thrissur', 'Thiruvananthapuram', 'Wayanad']
    },

    {
        State: 'Madhya Pradesh', Districts: ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashok Nagar', 'Balaghat', 'Barwani', 'Betul',
            'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda',
            'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa (East Nimar)', 'Khargone (West Nimar)', 'Mandla', 'Mandsaur', 'Morena',
            'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol',
            'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha']
    },

    {
        State: 'Maharashtra', Districts: ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur',
            'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai suburban', 'Nanded',
            'Nandurbar', 'Nagpur', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg',
            'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal']
    },

    {
        State: 'Manipur', Districts: ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching',
            'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul']
    },
    {
        State: 'Meghalaya', Districts: ['East Garo Hills', 'East Khasi Hills', 'East Jaintia Hills', 'North Garo Hills', 'Ri Bhoi',
            'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Jaintia Hills', 'West Garo Hills', 'West Khasi Hills']
    },
    { State: 'Mizoram', Districts: ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Serchhip'] },
    {
        State: 'Nagaland', Districts: ['Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Noklak', 'Peren', 'Phek', 'Tuensang',
            'Wokha', 'Zunheboto']
    },

    {
        State: 'Odisha', Districts: ['Angul', 'Boudh (Bauda)', 'Bhadrak', 'Balangir', 'Bargarh (Baragarh)', 'Balasore', 'Cuttack',
            'Debagarh (Deogarh)', 'Dhenkanal', 'Ganjam', 'Gajapati', 'Jharsuguda', 'Jajpur', 'Jagatsinghpur', 'Khordha', 'Kendujhar (Keonjhar)',
            'Kalahandi', 'Kandhamal', 'Koraput', 'Kendrapara', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nuapada', 'Nayagarh', 'Puri', 'Rayagada',
            'Sambalpur', 'Subarnapur (Sonepur)', 'Sundargarh']
    },

    {
        State: 'Punjab', Districts: ['Amritsar', 'Barnala', 'Bathinda', 'Firozpur', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
            'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Sri Muktsar Sahib', 'Pathankot', 'Patiala',
            'Rupnagar', 'Sahibzada Ajit Singh Nagar', 'Sangrur', 'Shahid Bhagat Singh Nagar', 'Tarn Taran']
    },

    {
        State: 'Rajasthan', Districts: ['Ajmer', 'Alwar', 'Bikaner', 'Barmer', 'Banswara', 'Bharatpur', 'Baran', 'Bundi', 'Bhilwara',
            'Churu', 'Chittorgarh', 'Dausa', 'Dholpur', 'Dungarpur', 'Ganganagar', 'Hanumangarh', 'Jhunjhunu', 'Jalore', 'Jodhpur', 'Jaipur',
            'Jaisalmer', 'Jhalawar', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sikar', 'Sawai Madhopur', 'Sirohi', 'Tonk',
            'Udaipur']
    },

    { State: 'Sikkim', Districts: ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'] },

    {
        State: 'Tamilnadu', Districts: ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
            'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam', 'Nilgiris', 'Namakkal',
            'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Tirupur', 'Tiruchirappalli', 'Theni',
            'Tirunelveli', 'Thanjavur', 'Thoothukudi', 'Tirupattur', 'Tiruvallur', 'Tiruvarur', 'Tiruvannamalai', 'Vellore', 'Viluppuram',
            'Virudhunagar']
    },

    {
        State: 'Telangana', Districts: ['Adilabad', 'Komaram Bheem', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
            'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Mahabubabad', 'Mahbubnagar', 'Mancherial',
            'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nalgonda', 'Narayanpet', 'Nagarkurnool', 'Nirmal', 'Nizamabad', 'Peddapalli',
            'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal Urban',
            'Warangal Rural', 'Yadadri Bhuvanagiri']
    },

    {
        State: 'Tripura', Districts: ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unokoti',
            'West Tripura']
    },

    {
        State: 'Uttar Pradesh', Districts: ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
            'Azamgarh', 'Bagpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun',
            'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad',
            'Gautam Buddh Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
            'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri',
            'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar',
            'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli',
            'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi']
    },

    {
        State: 'Uttarkhand', Districts: ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital',
            'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi']
    },

    {
        State: 'West Bengal', Districts: ['Alipurduar', 'Bankura', 'Paschim Bardhaman', 'Purba Bardhaman', 'Birbhum', 'Cooch Behar',
            'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Maldah', 'Murshidabad',
            'Nadia', 'North 24 Parganas', 'Paschim Medinipur', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur']
    },

    {
        State: 'Andaman and Nicobar', Districts: ['Nicobar',
            'North and Middle Andaman',
            'South Andaman']
    },
    { State: 'Chandigarh', Districts: ['Chandigarh'] },
    { State: 'Dadra and Nagar Haveli', Districts: ['Dadra and Nagar Haveli'] },
    { State: 'Daman and Diu', Districts: ['Daman', 'Diu'] },
    {
        State: 'Jammu and Kashmir', Districts: ['Anantnag', 'Bandipora', 'Baramulla', 'Badgam', 'Doda', 'Ganderbal', 'Jammu',
            'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar',
            'Udhampur']
    },
    { State: 'Ladakh', Districts: ['Kargil', 'Leh'] },
    { State: 'Lakshadweep', Districts: ['Lakshadweep'] },
    {
        State: 'Delhi', Districts: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
            'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi']
    },
    { State: 'Puducherry', Districts: ['Karaikal', 'Mahé', 'Pondicherry', 'Yanam'] }
];

export const FileTypes: IDropdownOption[] =
    [
        { key: FileType.png, text: FileType.png },
        { key: FileType.jpeg, text: FileType.jpeg },
        { key: FileType.mp3, text: FileType.mp3 },
        { key: FileType.mp4, text: FileType.mp4 },
        { key: FileType.pdf, text: FileType.pdf },
        { key: FileType.othersImage, text: FileType.othersImage },
        { key: FileType.youtube, text: FileType.youtube },
        { key: FileType.facebook, text: FileType.facebook },
        { key: FileType.msword, text: FileType.msword },
    ];

export const FileTypes2: IDropdownOption[] =
    [
        { key: FileType.othersImage, text: FileType.othersImage },
        { key: FileType.youtube, text: FileType.youtube },
        { key: FileType.facebook, text: FileType.facebook },
    ];

export const CategoryOptions: IDropdownOption[] = [
    { key: 'news', text: 'News' },
    { key: 'info', text: 'Useful Info' },
    { key: 'article', text: 'Article' },
    { key: 'curruption', text: 'Curruption' },
    { key: 'kcr', text: 'KCR' },
    { key: 'telangana', text: "Telangana" },
    { key: 'india', text: 'India' },
    { key: 'movie', text: 'Movies' },
    { key: 'sports', text: 'Sports' },
    { key: 'business', text: 'Business' },
    { key: 'trending', text: 'Trending' },
    { key: 'mustwatch', text: 'Mustwatch' },
    { key: 'timepass', text: 'Timepass' },
    { key: 'crime', text: 'crime' },
    { key: 'jobs', text: 'jobs' },
    { key: 'polls', text: 'Polls' },
    { key: 'corona', text: 'corona' }
];

export const ImageOnly: IDropdownOption[] =
    [
        { key: FileType.othersImage, text: FileType.othersImage }
    ];

export const NewsStatusD: IDropdownOption[] =
    [
        { key: NewsStatus.Submitted, text: NewsStatus.Submitted },
        { key: NewsStatus.Approved, text: NewsStatus.Approved },
        { key: NewsStatus.Process, text: NewsStatus.Process },
        { key: NewsStatus.Rejected, text: NewsStatus.Rejected }
    ];

export const NewsStatusU: IDropdownOption[] =
    [
        { key: NewsStatus.Submitted, text: NewsStatus.Submitted },
        { key: NewsStatus.Approved, text: NewsStatus.Approved },
        { key: NewsStatus.Rejected, text: NewsStatus.Rejected }
    ];

export const NewsCategory: IDropdownOption[] =
    [
        { key: 'all', text: 'All' },
        { key: 'news', text: 'News' },
        { key: 'info', text: 'Useful Info' },
        { key: 'article', text: 'Article' }
    ];

export const URLs = {
    getNewsForUserHomePage: '/api/gnfuhp',
    getLatestNews: '/api/getLatestNews',
    getNewsByFilter: '/api/gnbf',
    getNewsById: '/api/gnbi',
    getHeadLines: '/api/getheadlines',
    getTopNews: '/api/gettopnews',
    getAllNewsByUserId: '/api/getallnewsbyuserid',
    createNews: '/api/createnews',
    createNewsBySelfAdmin: '/api/createnewsbyselfadmin',
    raiseHelpRequest: '/api/raisehelprequest',
    registerUser: '/api/registeruser',
    getUserInfoAndNewsCount: '/api/guianc',
    getMyProfileInfo: '/api/getmyprofileinfo',
    updateMyProfile: '/api/updatemyprofile',
    checkIsUserAvailable: '/api/checkisuseravailable',
    changePassword: '/api/changepassword',
    login: '/api/login',
    uploadProfilePic: '/api/addprofilepiccc',
    approveAndPostNews: '/api/approveandpost',
    updateMainNews: '/api/updateetnews',
    createMainNews: '/api/createnews',
    getLatestNewsSubmittedByUser: '/api/getallnews',
    getTNewsByERefId: '/api/getnewsbyref',
    getAllNewsPostedByUser: '/api/getalluserpostednews',
    getRejectedNews: '/api/getrejectednews',
    getMainNewsByFilter: '/api/getnewsbyfilter',
    getMainNewsByFilter2: '/api/getallnewsad',
    getMainNewsByFilter3: '/api/getallmainnewsbyclientfilter',
    getNewsByFilterAll: '/api/getnewsbyfilterall',
    getNewsCountByCategory: '/api/getnewscountbycategory',
    getAllHelpRequest: '/api/getallhelprequests',
    getUserDetailsById: '/api/getuserdetailsbyid',
    getUserDetailsByIdAndNewsCount: '/api/getuserdetailsbyidandnewscount',
    getAllUsersByFilter: '/api/getallusersbyfilter',
    getAllSelfAdminRequests: '/api/getallselfadminrequests',
    getRejectedUsers: '/api/getrejectedusers',
    updateProfile: '/api/updateprofile',
    updateProfileForSelfAdmin: '/api/updateprofileforselfadmin',
    getAllNewsPostedByMe: '/api/getallnewspostedbyme',
    sendSelfAdminRequest: '/api/sendselfadminrequest',
    getAllNewsPostedByMeAndFilter: '/api/getallnewspostedbymeandfilter',
    getAllInfoForMyDashboard: '/api/getallinfoformydashboard',
    getAllUsersBySearch: '/api/getallusersbysearch',
    getAllUserPostedNewsByFilter: '/api/getalluserpostednewsbyfilter',


    getHelpRequestsCountByStatus: '/api/getHelpRequestsCountByStatus',
    acceptHelpRequestAndCreate: '/api/accepthelprequestandcreate',
    getHelpRequestsCountByCategory: '/api/getHelpRequestsCountByCategory',
    getAllHelpReqestsForAdmin: '/api/getallhelpreqestsforadmin',
    getAllEnHelpReqestsForAdmin: '/api/getallenhelpreqestsforadmin',
    getHelpRequestInTeByERefId: '/api/getHelpRequestInTeByERefId',
    updateHelpRequestInET: '/api/updateHelpRequestInET',

    postComment: '/api/postcomment',
    getCommentsByRef: '/api/getcommentsbyref',
    saveQuestion: '/api/savequestion',
    getQAsByRefId: '/api/getqasbyrefid',

    SavePersonInfo: '/api/savepersoninfo',
    updatePost: '/api/updatePost',
    getPosts: '/api/getposts',

    getPollOptionsByRefId: '/api/getpolloptionsbyrefId',
    SavePollResults: '/api/savepollresults',
    getPollResultsByRefId: '/api/getpollresultsbyrefid',

    checkIsUserIsPolled: '/api/checkisuserispolled',
    checkIsRequestSubmitted: '/api/checkisrequestsubmitted',
    getMyHelpRequests: '/api/getmyhelprequests',
    getUsersCountByAccountStatus: '/api/getUsersCountByAccountStatus',
    getAllUsersByFilter3: '/api/getAllUsersByFilter3',

    getNewsCountByStatus: '/api/getNewsCountByStatus',
    getAllUserNewsForAdmin: '/api/getAllUserNewsForAdmin',
    getPostsCountByStatus: '/api/getPostsCountByStatus',
    getAllPostsForAdmin: '/api/getAllPostsForAdmin',

    deleteUploadedFile: '/api/deleteUploadedFile',
    getAllFiles: '/api/getallfiles',
    getFilesByFilterAll: '/api/getFilesByFilterAll',

    addImages: '/api/addImages',
    getImages: '/api/getImages',
    updateImage: '/api/updateImage',

    addImagesM: '/api/addImagesm',
    getImagesM: '/api/getImagesm',
    updateImageM: '/api/updateImagem',
    saveQuery: '/api/saveQuery',
    raiseDonationRequest: '/api/raiseDonationRequest',
    updateDonationRequest: '/api/updateDonationRequest',

    downloadfile : '/api/downloadfile',
    deleteFile : '/api/deleteFile'
}

export const UserType = {
    Normal: 1,
    SelfAdmin: 2,
    Admin: 3,
    SuperAdmin: 4
}