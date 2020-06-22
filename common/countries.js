module.exports = {
    countriesMap,
    countriesList,
    states,
    getCountryName,
    getStateName
};

var states = {
    "CA": [
        {
            "code": "AB",
            "name": "Alberta"
        },
        {
            "code": "BC",
            "name": "British Columbia"
        },
        {
            "code": "MB",
            "name": "Manitoba"
        },
        {
            "code": "NB",
            "name": "New Brunswick"
        },
        {
            "code": "NL",
            "name": "Newfoundland and Labrador"
        },
        {
            "code": "NS",
            "name": "Nova Scotia"
        },
        {
            "code": "NT",
            "name": "Northwest Territories"
        },
        {
            "code": "NU",
            "name": "Nunavut"
        },
        {
            "code": "ON",
            "name": "Ontario"
        },
        {
            "code": "PE",
            "name": "Prince Edward Island"
        },
        {
            "code": "QC",
            "name": "Quebec"
        },
        {
            "code": "SK",
            "name": "Saskatchewan"
        },
        {
            "code": "YT",
            "name": "Yukon"
        }
    ],
        "AU" : [
        {
            "code": "ACT",
            "name": "Australian Capital Territory"
        },
        {
            "code": "NSW",
            "name": "New South Wales"
        },
        {
            "code": "NT",
            "name": "Northern Territory"
        },
        {
            "code": "QLD",
            "name": "Queensland"
        },
        {
            "code": "SA",
            "name": "South Australia"
        },
        {
            "code": "TAS",
            "name": "Tasmania"
        },
        {
            "code": "VIC",
            "name": "Victoria"
        },
        {
            "code": "WA",
            "name": "Western Australia"
        }
    ],
        "US": [
        {
            "code": "AA",
            "name": "Armed Forces Americas (except Canada)"
        },
        {
            "code": "AE",
            "name": "Armed Forces"
        },
        {
            "code": "AK",
            "name": "Alaska"
        },
        {
            "code": "AL",
            "name": "Alabama"
        },
        {
            "code": "AP",
            "name": "Armed Forces Pacific"
        },
        {
            "code": "AR",
            "name": "Arkansas"
        },
        {
            "code": "AS",
            "name": "American Samoa"
        },
        {
            "code": "AZ",
            "name": "Arizona"
        },
        {
            "code": "CA",
            "name": "California"
        },
        {
            "code": "CO",
            "name": "Colorado"
        },
        {
            "code": "CT",
            "name": "Connecticut"
        },
        {
            "code": "DC",
            "name": "District of Columbia"
        },
        {
            "code": "DE",
            "name": "Delaware"
        },
        {
            "code": "FL",
            "name": "Florida"
        },
        {
            "code": "FM",
            "name": "Federated States of Micronesia"
        },
        {
            "code": "GA",
            "name": "Georgia"
        },
        {
            "code": "GU",
            "name": "Guam"
        },
        {
            "code": "HI",
            "name": "Hawaii"
        },
        {
            "code": "IA",
            "name": "Iowa"
        },
        {
            "code": "ID",
            "name": "Idaho"
        },
        {
            "code": "IL",
            "name": "Illinois"
        },
        {
            "code": "IN",
            "name": "Indiana"
        },
        {
            "code": "KS",
            "name": "Kansas"
        },
        {
            "code": "KY",
            "name": "Kentucky"
        },
        {
            "code": "LA",
            "name": "Louisiana"
        },
        {
            "code": "MA",
            "name": "Massachusetts"
        },
        {
            "code": "MD",
            "name": "Maryland"
        },
        {
            "code": "ME",
            "name": "Maine"
        },
        {
            "code": "MH",
            "name": "Marshall Islands"
        },
        {
            "code": "MI",
            "name": "Michigan"
        },
        {
            "code": "MN",
            "name": "Minnesota"
        },
        {
            "code": "MO",
            "name": "Missouri"
        },
        {
            "code": "MP",
            "name": "Northern Mariana Islands"
        },
        {
            "code": "MS",
            "name": "Mississippi"
        },
        {
            "code": "MT",
            "name": "Montana"
        },
        {
            "code": "NC",
            "name": "North Carolina"
        },
        {
            "code": "ND",
            "name": "North Dakota"
        },
        {
            "code": "NE",
            "name": "Nebraska"
        },
        {
            "code": "NH",
            "name": "New Hampshire"
        },
        {
            "code": "NJ",
            "name": "New Jersey"
        },
        {
            "code": "NM",
            "name": "New Mexico"
        },
        {
            "code": "NV",
            "name": "Nevada"
        },
        {
            "code": "NY",
            "name": "New York"
        },
        {
            "code": "OH",
            "name": "Ohio"
        },
        {
            "code": "OK",
            "name": "Oklahoma"
        },
        {
            "code": "OR",
            "name": "Oregon"
        },
        {
            "code": "PA",
            "name": "Pennsylvania"
        },
        {
            "code": "PR",
            "name": "Puerto Rico"
        },
        {
            "code": "PW",
            "name": "Palau"
        },
        {
            "code": "RI",
            "name": "Rhode Island"
        },
        {
            "code": "SC",
            "name": "South Carolina"
        },
        {
            "code": "SD",
            "name": "South Dakota"
        },
        {
            "code": "TN",
            "name": "Tennessee"
        },
        {
            "code": "TX",
            "name": "Texas"
        },
        {
            "code": "UT",
            "name": "Utah"
        },
        {
            "code": "VA",
            "name": "Virginia"
        },
        {
            "code": "VI",
            "name": "Virgin Islands"
        },
        {
            "code": "VT",
            "name": "Vermont"
        },
        {
            "code": "WA",
            "name": "Washington"
        },
        {
            "code": "WI",
            "name": "Wisconsin"
        },
        {
            "code": "WV",
            "name": "West Virginia"
        },
        {
            "code": "WY",
            "name": "Wyoming"
        }
    ]
};


var countriesMap = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};


var countriesList  = CreateCountriesList();

function CreateCountriesList()
{
    let keys = Object.keys(countriesMap);
    let list = [];
    let n = keys.length;
    for(var i = 0 ; i< n;++i)
    {
        list.push({
            shippingCountryCode: keys[i],
            shippingCountryName: countriesMap[keys[i]]
        });
    }
    return list;
}

function getCountryName (countryCode) {
    if (countriesMap.hasOwnProperty(countryCode)) {
        return countriesMap[countryCode];
    } else {
        return countryCode;
    }
}

function getStateName(countryCode, stateCode)
{
    if (states.hasOwnProperty(countryCode)) {
        let statesList = states[countryCode];
        let n = statesList.length;
        for(var i =0; i < n;++i)
        {
            if(statesList[i].code == stateCode)
            {
                return statesList[i].name;
            }
        }
    } else {

    }
    return "";
}
