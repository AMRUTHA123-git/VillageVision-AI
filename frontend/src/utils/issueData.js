// ============================================================
// VillageVision AI - Shared Issue Data & Persistence Engine
// ============================================================

const STORAGE_KEY = 'villagevision_issues';

// ============================================================
// ISSUE CATEGORIES
// Used for AI categorization / filtering / reporting
// ============================================================

export const ISSUE_CATEGORIES = [
  'Road Damage',
  'Water Leakage',
  'Broken Streetlight',
  'Garbage Overflow',
  'Drainage Problem',
  'Water Supply',
  'Electricity Problem',
  'Public Toilet',
  'School Infrastructure',
  'Healthcare Facility',
  'Transportation',
  'Internet / Network',
  'Street Safety',
  'Government Service',
  'Other'
];

// ============================================================
// LOCATION HIERARCHY
// State → District → Village / Town
//
// "Other" is available so the user can enter a location
// that is not present in the demonstration dataset.
// ============================================================

export const LOCATION_HIERARCHY = {

  // ==========================================================
  // ANDHRA PRADESH
  // ==========================================================

  'Andhra Pradesh': {

    'Alluri Sitharama Raju': [
      'Paderu',
      'Araku Valley',
      'Rampachodavaram',
      'Chintapalle',
      'Other'
    ],

    'Anakapalli': [
      'Anakapalli',
      'Narsipatnam',
      'Yelamanchili',
      'Chodavaram',
      'Madugula',
      'Other'
    ],

    'Anantapur': [
      'Anantapur',
      'Gooty',
      'Guntakal',
      'Rayadurg',
      'Uravakonda',
      'Other'
    ],

    'Bapatla': [
      'Bapatla',
      'Chirala',
      'Repalle',
      'Ponnur',
      'Other'
    ],

    'Chittoor': [
      'Chittoor',
      'Madanapalle',
      'Punganur',
      'Palamaner',
      'Other'
    ],

    'Dr. B.R. Ambedkar Konaseema': [
      'Amalapuram',
      'Razole',
      'Kothapeta',
      'Mummidivaram',
      'Other'
    ],

    'East Godavari': [
      'Rajamahendravaram',
      'Rajahmundry',
      'Kovvur',
      'Nidadavole',
      'Other'
    ],

    'Eluru': [
      'Eluru',
      'Nuzvid',
      'Jangareddygudem',
      'Chintalapudi',
      'Other'
    ],

    'Guntur': [
      'Guntur',
      'Tenali',
      'Mangalagiri',
      'Sattenapalle',
      'Other'
    ],

    'Kakinada': [
      'Kakinada',
      'Tuni',
      'Annavaram',
      'Peddapuram',
      'Pithapuram',
      'Samalkota',
      'Prathipadu',
      'Jaggampeta',
      'Other'
    ],

    'Krishna': [
      'Machilipatnam',
      'Gudivada',
      'Pedana',
      'Vuyyuru',
      'Other'
    ],

    'Kurnool': [
      'Kurnool',
      'Adoni',
      'Nandyal',
      'Dhone',
      'Other'
    ],

    'Nandyal': [
      'Nandyal',
      'Dhone',
      'Allagadda',
      'Banaganapalle',
      'Other'
    ],

    'NTR': [
      'Vijayawada',
      'Nandigama',
      'Tiruvuru',
      'Jaggayyapeta',
      'Other'
    ],

    'Palnadu': [
      'Narasaraopet',
      'Sattenapalle',
      'Vinukonda',
      'Macherla',
      'Other'
    ],

    'Parvathipuram Manyam': [
      'Parvathipuram',
      'Salur',
      'Kurupam',
      'Other'
    ],

    'Prakasam': [
      'Ongole',
      'Chirala',
      'Markapur',
      'Kandukur',
      'Other'
    ],

    'Srikakulam': [
      'Srikakulam',
      'Palasa',
      'Amadalavalasa',
      'Narasannapeta',
      'Other'
    ],

    'Sri Potti Sriramulu Nellore': [
      'Nellore',
      'Kavali',
      'Gudur',
      'Atmakur',
      'Other'
    ],

    'Tirupati': [
      'Tirupati',
      'Srikalahasti',
      'Sullurpeta',
      'Venkatagiri',
      'Other'
    ],

    'Visakhapatnam': [
      'Visakhapatnam',
      'Bheemunipatnam',
      'Gajuwaka',
      'Anakapalle',
      'Other'
    ],

    'Vizianagaram': [
      'Vizianagaram',
      'Bobbili',
      'Gajapathinagaram',
      'Parvathipuram',
      'Other'
    ],

    'West Godavari': [
      'Bhimavaram',
      'Narasapur',
      'Tanuku',
      'Tadepalligudem',
      'Other'
    ],

    'YSR Kadapa': [
      'Kadapa',
      'Proddatur',
      'Rajampet',
      'Pulivendula',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // TELANGANA
  // ==========================================================

  'Telangana': {

    'Adilabad': [
      'Adilabad',
      'Bhainsa',
      'Boath',
      'Other'
    ],

    'Bhadradri Kothagudem': [
      'Kothagudem',
      'Palvancha',
      'Manuguru',
      'Other'
    ],

    'Hyderabad': [
      'Hyderabad',
      'Secunderabad',
      'Charminar',
      'Other'
    ],

    'Jagtial': [
      'Jagtial',
      'Korutla',
      'Metpally',
      'Other'
    ],

    'Karimnagar': [
      'Karimnagar',
      'Huzurabad',
      'Choppadandi',
      'Other'
    ],

    'Khammam': [
      'Khammam',
      'Madhira',
      'Kusumanchi',
      'Other'
    ],

    'Mahabubnagar': [
      'Mahbubnagar',
      'Jadcherla',
      'Narayanpet',
      'Other'
    ],

    'Medak': [
      'Medak',
      'Narsapur',
      'Toopran',
      'Other'
    ],

    'Medchal-Malkajgiri': [
      'Medchal',
      'Malkajgiri',
      'Kompally',
      'Quthbullapur',
      'Other'
    ],

    'Nalgonda': [
      'Nalgonda',
      'Miryalaguda',
      'Devarakonda',
      'Other'
    ],

    'Nizamabad': [
      'Nizamabad',
      'Bodhan',
      'Armoor',
      'Other'
    ],

    'Ranga Reddy': [
      'Shamshabad',
      'Ibrahimpatnam',
      'Chevella',
      'Rajendranagar',
      'Other'
    ],

    'Sangareddy': [
      'Sangareddy',
      'Patancheru',
      'Zaheerabad',
      'Other'
    ],

    'Siddipet': [
      'Siddipet',
      'Gajwel',
      'Husnabad',
      'Other'
    ],

    'Suryapet': [
      'Suryapet',
      'Kodad',
      'Huzurnagar',
      'Other'
    ],

    'Warangal': [
      'Warangal',
      'Hanamkonda',
      'Parkal',
      'Narsampet',
      'Other'
    ],

    'Yadadri Bhuvanagiri': [
      'Bhongir',
      'Choutuppal',
      'Alair',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // KARNATAKA
  // ==========================================================

  'Karnataka': {

    'Bengaluru Rural': [
      'Devanahalli',
      'Doddaballapur',
      'Nelamangala',
      'Hoskote',
      'Other'
    ],

    'Bengaluru Urban': [
      'Bengaluru',
      'Yelahanka',
      'Anekal',
      'Electronic City',
      'Other'
    ],

    'Belagavi': [
      'Belagavi',
      'Gokak',
      'Chikodi',
      'Athani',
      'Other'
    ],

    'Dakshina Kannada': [
      'Mangaluru',
      'Bantwal',
      'Puttur',
      'Sullia',
      'Other'
    ],

    'Dharwad': [
      'Dharwad',
      'Hubballi',
      'Kalghatgi',
      'Other'
    ],

    'Mysuru': [
      'Mysuru',
      'Nanjangud',
      'Hunsur',
      'T. Narasipura',
      'Other'
    ],

    'Shivamogga': [
      'Shivamogga',
      'Bhadravati',
      'Sagar',
      'Other'
    ],

    'Udupi': [
      'Udupi',
      'Kundapura',
      'Karkala',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // TAMIL NADU
  // ==========================================================

  'Tamil Nadu': {

    'Chennai': [
      'Chennai',
      'Avadi',
      'Tambaram',
      'Other'
    ],

    'Coimbatore': [
      'Coimbatore',
      'Pollachi',
      'Mettupalayam',
      'Other'
    ],

    'Madurai': [
      'Madurai',
      'Melur',
      'Thirumangalam',
      'Other'
    ],

    'Salem': [
      'Salem',
      'Attur',
      'Mettur',
      'Other'
    ],

    'Tiruchirappalli': [
      'Tiruchirappalli',
      'Manapparai',
      'Musiri',
      'Other'
    ],

    'Tirunelveli': [
      'Tirunelveli',
      'Palayamkottai',
      'Ambasamudram',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // MAHARASHTRA
  // ==========================================================

  'Maharashtra': {

    'Mumbai City': [
      'Mumbai',
      'Colaba',
      'Dadar',
      'Other'
    ],

    'Mumbai Suburban': [
      'Andheri',
      'Borivali',
      'Bandra',
      'Other'
    ],

    'Pune': [
      'Pune',
      'Baramati',
      'Shirur',
      'Lonavala',
      'Other'
    ],

    'Nagpur': [
      'Nagpur',
      'Kamptee',
      'Hingna',
      'Other'
    ],

    'Nashik': [
      'Nashik',
      'Malegaon',
      'Sinnar',
      'Other'
    ],

    'Thane': [
      'Thane',
      'Kalyan',
      'Bhiwandi',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // KERALA
  // ==========================================================

  'Kerala': {

    'Thiruvananthapuram': [
      'Thiruvananthapuram',
      'Neyyattinkara',
      'Attingal',
      'Other'
    ],

    'Ernakulam': [
      'Kochi',
      'Aluva',
      'Perumbavoor',
      'Other'
    ],

    'Kozhikode': [
      'Kozhikode',
      'Vadakara',
      'Koyilandy',
      'Other'
    ],

    'Thrissur': [
      'Thrissur',
      'Chalakudy',
      'Guruvayur',
      'Other'
    ],

    'Kollam': [
      'Kollam',
      'Karunagappally',
      'Punalur',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // ODISHA
  // ==========================================================

  'Odisha': {

    'Khordha': [
      'Bhubaneswar',
      'Jatani',
      'Khurda',
      'Other'
    ],

    'Cuttack': [
      'Cuttack',
      'Athagarh',
      'Banki',
      'Other'
    ],

    'Ganjam': [
      'Berhampur',
      'Chhatrapur',
      'Asika',
      'Other'
    ],

    'Puri': [
      'Puri',
      'Konark',
      'Pipili',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // WEST BENGAL
  // ==========================================================

  'West Bengal': {

    'Kolkata': [
      'Kolkata',
      'Salt Lake',
      'Behala',
      'Other'
    ],

    'Howrah': [
      'Howrah',
      'Uluberia',
      'Amta',
      'Other'
    ],

    'North 24 Parganas': [
      'Barasat',
      'Barrackpore',
      'Basirhat',
      'Other'
    ],

    'South 24 Parganas': [
      'Diamond Harbour',
      'Canning',
      'Sonarpur',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // GUJARAT
  // ==========================================================

  'Gujarat': {

    'Ahmedabad': [
      'Ahmedabad',
      'Dholka',
      'Sanand',
      'Other'
    ],

    'Surat': [
      'Surat',
      'Bardoli',
      'Olpad',
      'Other'
    ],

    'Vadodara': [
      'Vadodara',
      'Padra',
      'Karjan',
      'Other'
    ],

    'Rajkot': [
      'Rajkot',
      'Gondal',
      'Jetpur',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // RAJASTHAN
  // ==========================================================

  'Rajasthan': {

    'Jaipur': [
      'Jaipur',
      'Amer',
      'Sanganer',
      'Other'
    ],

    'Jodhpur': [
      'Jodhpur',
      'Bilara',
      'Osian',
      'Other'
    ],

    'Udaipur': [
      'Udaipur',
      'Gogunda',
      'Salumbar',
      'Other'
    ],

    'Kota': [
      'Kota',
      'Ladpura',
      'Ramganj Mandi',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // UTTAR PRADESH
  // ==========================================================

  'Uttar Pradesh': {

    'Lucknow': [
      'Lucknow',
      'Malihabad',
      'Mohan',
      'Other'
    ],

    'Varanasi': [
      'Varanasi',
      'Ramnagar',
      'Pindra',
      'Other'
    ],

    'Agra': [
      'Agra',
      'Fatehabad',
      'Kiraoli',
      'Other'
    ],

    'Prayagraj': [
      'Prayagraj',
      'Phulpur',
      'Koraon',
      'Other'
    ],

    'Kanpur Nagar': [
      'Kanpur',
      'Bilhaur',
      'Ghatampur',
      'Other'
    ],

    'Gorakhpur': [
      'Gorakhpur',
      'Sahjanwa',
      'Chauri Chaura',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // BIHAR
  // ==========================================================

  'Bihar': {

    'Patna': [
      'Patna',
      'Danapur',
      'Fatuha',
      'Other'
    ],

    'Gaya': [
      'Gaya',
      'Bodh Gaya',
      'Tekari',
      'Other'
    ],

    'Muzaffarpur': [
      'Muzaffarpur',
      'Kanti',
      'Sakra',
      'Other'
    ],

    'Bhagalpur': [
      'Bhagalpur',
      'Kahalgaon',
      'Naugachhia',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // MADHYA PRADESH
  // ==========================================================

  'Madhya Pradesh': {

    'Bhopal': [
      'Bhopal',
      'Berasia',
      'Other'
    ],

    'Indore': [
      'Indore',
      'Mhow',
      'Depalpur',
      'Other'
    ],

    'Gwalior': [
      'Gwalior',
      'Dabra',
      'Bhitarwar',
      'Other'
    ],

    'Jabalpur': [
      'Jabalpur',
      'Patan',
      'Sihora',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // PUNJAB
  // ==========================================================

  'Punjab': {

    'Ludhiana': [
      'Ludhiana',
      'Khanna',
      'Jagraon',
      'Other'
    ],

    'Amritsar': [
      'Amritsar',
      'Ajnala',
      'Majitha',
      'Other'
    ],

    'Patiala': [
      'Patiala',
      'Rajpura',
      'Samana',
      'Other'
    ],

    'Jalandhar': [
      'Jalandhar',
      'Nakodar',
      'Phillaur',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // HARYANA
  // ==========================================================

  'Haryana': {

    'Gurugram': [
      'Gurugram',
      'Sohna',
      'Pataudi',
      'Other'
    ],

    'Faridabad': [
      'Faridabad',
      'Ballabgarh',
      'Tigaon',
      'Other'
    ],

    'Hisar': [
      'Hisar',
      'Hansi',
      'Barwala',
      'Other'
    ],

    'Panipat': [
      'Panipat',
      'Samalkha',
      'Israna',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // DELHI
  // ==========================================================

  'Delhi': {

    'New Delhi': [
      'New Delhi',
      'Dwarka',
      'Rohini',
      'Saket',
      'Other'
    ],

    'Central Delhi': [
      'Karol Bagh',
      'Paharganj',
      'Other'
    ],

    'South Delhi': [
      'Saket',
      'Mehrauli',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // JAMMU & KASHMIR
  // ==========================================================

  'Jammu and Kashmir': {

    'Jammu': [
      'Jammu',
      'Akhnoor',
      'Bishnah',
      'Other'
    ],

    'Srinagar': [
      'Srinagar',
      'Ganderbal',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // JHARKHAND
  // ==========================================================

  'Jharkhand': {

    'Ranchi': [
      'Ranchi',
      'Bundu',
      'Kanke',
      'Other'
    ],

    'East Singhbhum': [
      'Jamshedpur',
      'Ghatshila',
      'Other'
    ],

    'Dhanbad': [
      'Dhanbad',
      'Sindri',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // CHHATTISGARH
  // ==========================================================

  'Chhattisgarh': {

    'Raipur': [
      'Raipur',
      'Abhanpur',
      'Arang',
      'Other'
    ],

    'Bilaspur': [
      'Bilaspur',
      'Takhatpur',
      'Other'
    ],

    'Durg': [
      'Durg',
      'Bhilai',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // ASSAM
  // ==========================================================

  'Assam': {

    'Kamrup Metropolitan': [
      'Guwahati',
      'Dispur',
      'Other'
    ],

    'Dibrugarh': [
      'Dibrugarh',
      'Naharkatia',
      'Other'
    ],

    'Jorhat': [
      'Jorhat',
      'Titabor',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // GOA
  // ==========================================================

  'Goa': {

    'North Goa': [
      'Panaji',
      'Mapusa',
      'Pernem',
      'Other'
    ],

    'South Goa': [
      'Margao',
      'Vasco da Gama',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // HIMACHAL PRADESH
  // ==========================================================

  'Himachal Pradesh': {

    'Shimla': [
      'Shimla',
      'Theog',
      'Other'
    ],

    'Kangra': [
      'Dharamshala',
      'Palampur',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // UTTARAKHAND
  // ==========================================================

  'Uttarakhand': {

    'Dehradun': [
      'Dehradun',
      'Mussoorie',
      'Rishikesh',
      'Other'
    ],

    'Haridwar': [
      'Haridwar',
      'Roorkee',
      'Other'
    ],

    'Nainital': [
      'Nainital',
      'Haldwani',
      'Other'
    ],

    'Other': [
      'Other'
    ]
  },

  // ==========================================================
  // GOA / OTHER STATES FALLBACK
  // ==========================================================

  'Other': {
    'Other': [
      'Other'
    ]
  }
};


// ============================================================
// BACKWARD COMPATIBILITY
//
// Some existing components may still import LOCATION_DATA.
// Keep it available so existing code doesn't break.
// ============================================================

export const LOCATION_DATA = LOCATION_HIERARCHY;


// ============================================================
// INITIAL REALISTIC DEMO RECORDS
// ============================================================

export const INITIAL_DEMO_ISSUES = [

  {
    id: 'VV-1042',
    category: 'Road Damage',
    description:
      'Severe asphalt erosion and deep potholes causing traffic delays and vehicle damage near primary school entrance.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Kakinada',
    village: 'Tuni',
    area: 'School Road',
    latitude: 17.3542,
    longitude: 82.5488,
    priority: 'High',
    status: 'Open',
    reportedBy: 'Amrutha Varshini',
    reportedByRole: 'Citizen',
    date: '2026-08-18'
  },

  {
    id: 'VV-1043',
    category: 'Water Leakage',
    description:
      'Main clean water pipeline leaking onto public walkway near Sector 4 community center.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Kakinada',
    village: 'Tuni',
    area: 'Sector 4',
    latitude: 17.3580,
    longitude: 82.5520,
    priority: 'High',
    status: 'In Progress',
    reportedBy: 'Ramesh Kumar',
    reportedByRole: 'Citizen',
    date: '2026-08-19'
  },

  {
    id: 'VV-1039',
    category: 'Broken Streetlight',
    description:
      'Dark street corner due to non-functioning LED streetlight fixture near evening bus stop.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Kakinada',
    village: 'Annavaram',
    area: 'Market Area',
    latitude: 17.3510,
    longitude: 82.5450,
    priority: 'Medium',
    status: 'Verified',
    reportedBy: 'Kiran Sarma',
    reportedByRole: 'Government Authority',
    date: '2026-08-17'
  },

  {
    id: 'VV-1028',
    category: 'Garbage Overflow',
    description:
      'Unattended municipal waste bin overflowing and attracting pests in commercial zone.',
    photo: null,
    state: 'Telangana',
    district: 'Ranga Reddy',
    village: 'Shamshabad',
    area: 'Main Road',
    latitude: 17.2472,
    longitude: 78.4294,
    priority: 'Medium',
    status: 'Resolved',
    reportedBy: 'Green Earth NGO',
    reportedByRole: 'NGO / Volunteer',
    date: '2026-08-15'
  },

  {
    id: 'VV-1015',
    category: 'Drainage Problem',
    description:
      'Clogged storm drain backing up water onto pedestrian pathway during heavy rains.',
    photo: null,
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    village: 'Devanahalli',
    area: 'Temple Street',
    latitude: 13.2482,
    longitude: 77.7126,
    priority: 'High',
    status: 'Assigned',
    reportedBy: 'Suresh Rao',
    reportedByRole: 'Volunteer',
    date: '2026-08-12'
  }

];


// ============================================================
// GET STORED ISSUES
// ============================================================

export function getStoredIssues() {

  try {

    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {
      return JSON.parse(data);
    }

  } catch (error) {

    console.error(
      'Failed to parse stored issues:',
      error
    );

  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(INITIAL_DEMO_ISSUES)
  );

  return INITIAL_DEMO_ISSUES;
}


// ============================================================
// SAVE NEW ISSUE
// ============================================================

export function saveIssue(newIssueData = {}) {

  const existing = getStoredIssues();

  // Generate a safe unique issue ID
  const maxId = existing.reduce(
    (max, item) => {

      const number = parseInt(
        String(item.id || '').replace('VV-', ''),
        10
      );

      return Number.isNaN(number)
        ? max
        : Math.max(max, number);

    },
    1044
  );

  const newRecord = {

    id: `VV-${maxId + 1}`,

    category:
      newIssueData.category ||
      'Other',

    description:
      newIssueData.description ||
      '',

    photo:
      newIssueData.photo ||
      null,

    state:
      newIssueData.state ||
      '',

    district:
      newIssueData.district ||
      '',

    village:
      newIssueData.village ||
      '',

    area:
      newIssueData.area ||
      '',

    latitude:
      Number.isFinite(
        parseFloat(newIssueData.latitude)
      )
        ? parseFloat(newIssueData.latitude)
        : 17.3542,

    longitude:
      Number.isFinite(
        parseFloat(newIssueData.longitude)
      )
        ? parseFloat(newIssueData.longitude)
        : 82.5488,

    priority:
      newIssueData.priority ||
      'Medium',

    status:
      'Open',

    reportedBy:
      newIssueData.reportedBy ||
      'Authenticated User',

    reportedByRole:
      newIssueData.reportedByRole ||
      'Citizen',

    date:
      new Date()
        .toISOString()
        .split('T')[0]

  };

  const updated = [
    newRecord,
    ...existing
  ];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  return newRecord;
}


// ============================================================
// UPDATE ISSUE STATUS
// ============================================================

export function updateIssueStatus(
  id,
  newStatus,
  assignedDept = null
) {

  const existing = getStoredIssues();

  const updated = existing.map(item => {

    if (item.id === id) {

      return {
        ...item,

        status:
          newStatus,

        assignedDepartment:
          assignedDept ||
          item.assignedDepartment

      };

    }

    return item;

  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  return updated;
}


// ============================================================
// FILTER ENGINE
//
// Supports:
//
// State
// District
// Village
// Area
// Category
// Status
// Priority
// Search
// ============================================================

export function filterIssues(
  issues,
  filters = {}
) {

  if (!Array.isArray(issues)) {
    return [];
  }

  const {
    state,
    district,
    village,
    area,
    category,
    status,
    priority,
    search
  } = filters;


  return issues.filter(item => {

    // State
    if (
      state &&
      item.state !== state
    ) {
      return false;
    }


    // District
    if (
      district &&
      item.district !== district
    ) {
      return false;
    }


    // Village
    if (
      village &&
      item.village !== village
    ) {
      return false;
    }


    // Area
    if (
      area &&
      area.trim() &&
      !String(item.area || '')
        .toLowerCase()
        .includes(
          area.trim().toLowerCase()
        )
    ) {
      return false;
    }


    // Category
    if (
      category &&
      item.category !== category
    ) {
      return false;
    }


    // Status
    if (
      status &&
      item.status !== status
    ) {
      return false;
    }


    // Priority
    if (
      priority &&
      item.priority !== priority
    ) {
      return false;
    }


    // Global search
    if (
      search &&
      search.trim() !== ''
    ) {

      const q =
        search
          .toLowerCase()
          .trim();

      const matchText = [

        item.id,

        item.category,

        item.description,

        item.village,

        item.area,

        item.district,

        item.state,

        item.reportedBy,

        item.status,

        item.priority

      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();


      if (
        !matchText.includes(q)
      ) {
        return false;
      }

    }


    return true;

  });

}


// ============================================================
// HELPER FUNCTIONS
// Useful for dropdowns and filters
// ============================================================

export function getStates() {

  return Object.keys(
    LOCATION_HIERARCHY
  ).sort();

}


export function getDistricts(state) {

  if (
    !state ||
    !LOCATION_HIERARCHY[state]
  ) {
    return [];
  }

  return Object.keys(
    LOCATION_HIERARCHY[state]
  ).sort();

}


export function getVillages(
  state,
  district
) {

  if (
    !state ||
    !district ||
    !LOCATION_HIERARCHY[state] ||
    !LOCATION_HIERARCHY[state][district]
  ) {
    return [];
  }

  return [
    ...LOCATION_HIERARCHY[state][district]
  ].sort();

}


// ============================================================
// ADD CUSTOM LOCATION
//
// Allows your UI to support:
//
// + Add District
// + Add Village
//
// This updates the browser's current session data.
// ============================================================

export function addCustomLocation(
  state,
  district,
  village
) {

  if (!state) {
    return false;
  }

  if (!LOCATION_HIERARCHY[state]) {
    LOCATION_HIERARCHY[state] = {};
  }

  if (
    district &&
    !LOCATION_HIERARCHY[state][district]
  ) {

    LOCATION_HIERARCHY[state][district] = [
      'Other'
    ];

  }

  if (
    district &&
    village
  ) {

    const villages =
      LOCATION_HIERARCHY[state][district];

    if (
      !villages.includes(village)
    ) {

      const otherIndex =
        villages.indexOf('Other');

      if (otherIndex >= 0) {

        villages.splice(
          otherIndex,
          0,
          village
        );

      } else {

        villages.push(village);

      }

    }

  }

  return true;
}