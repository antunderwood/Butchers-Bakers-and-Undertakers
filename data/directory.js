// Transcribed from "A Directory of Shops in Abbots Langley High Street", Butchers, Bakers and
// Undertakers (BBU) project, Abbots Langley Local History Society, updated June 2026.
//
// Each entry lists its occupants newest first, as the directory does. In `lines`:
//   {3,6}    footnote numbers, keyed to SOURCES below
//   "# ..."  a sub-heading, where neighbouring numbers are shown as one entry
//   "~ ..."  an editorial note (italic in the directory)
// Dashes in the directory are written as commas or colons here.
//
// Map positions are the OpenStreetMap element named in `osm`, fetched Sept/Oct 2026: check
// one at openstreetmap.org/<osm> (OSM still names no. 16 "Your Move", its previous occupant;
// same premises). Positions without `osm` were placed by hand in the site editor. Entries
// without a position (houses, demolished buildings) have no marker. `featured` entries (at
// most 10) go on the front page; every entry also appears on its section's page. `summary`
// and `description` are optional extra text.
//
// The site editor (editor.html) rewrites everything from `const DIRECTORY = [` down, one
// entry per line: comments inside the list other than the section dividers are not kept.

const SOURCES = {
  1: "Abbots Langley: A Hertfordshire Village (Hastie & Spain)",
  2: "Adverts in St Lawrence Church magazines",
  3: "Kelly's Directories and Kelly's Trade Directories",
  4: "Abbots Langley Parish Guides (ALPC)",
  5: "Facebook inc Abbots Langley Matters",
  6: "Census 1861, 1881, 1891, 1901, 1921",
  7: "ALLHS Journals",
  8: "Abbots Langley Then & Now 1760-1960 (Clive Clark)",
  9: "Original conveyances, leases, and epitomes of title",
  10: "Deeds",
  11: "Hertfordshire Archives & Local Studies",
  12: "closedpubs.co.uk/hertfordshire/abbotslangley",
  13: "Hemel Hempstead Gazette & West Herts Advertiser",
  14: "Rate Charge Books, Watford RDC",
  15: "Boots Archives",
  16: "Watford Observer",
  17: "ALLHS Reminiscences",
  18: "speel.me.uk/chlondon/abbotslangley.htm",
  19: "Waitrose/John Lewis: The Gazette",
  20: "Eve Durtnall: photograph",
  21: "The Villager: Billy Crush",
  22: "Various individual contributors"
};

// Sections in the directory's order, keyed by the name used in links (directory.html?section=<key>). `side` is the side of the street (the directory's south-east
// and north-west); `place` names the street within it, for the front page's side-by-side tiles.
const GROUPS = {
  "south-side": { title: "High Street, south side", short: "South side", side: "south", place: "High Street", sub: "The odd numbers" },
  "langley-parade": {
    title: "Langley Parade", short: "Langley Parade", side: "south", place: "Langley Parade",
    sub: "Formerly “Creasy’s Parade”, on the south side between nos. 69 and 71",
    photos: ["img/directory/lp-then.jpg", "img/directory/lp-now.jpg"],
    extras: [["img/directory/lp-drawing.jpg", "Langley Parade, drawing by Prue King"]]
  },
  "north-side": { title: "High Street, north side", short: "North side", side: "north", place: "High Street", sub: "The even numbers" },
  "causeway-parade": { title: "Causeway Parade", short: "Causeway Parade", side: "north", place: "Causeway Parade", sub: "On the north side, built in 1958" }
};

const IMG = "img/directory/";
const pair = (key) => [IMG + key + "-then.jpg", IMG + key + "-now.jpg"];
const advert = (key, what = "Advert from a St Lawrence Church magazine") => [IMG + key + ".jpg", what];

const DIRECTORY = [
  // ---- Odd numbers: south-east side of High Street ----
  { group: "south-side", no: "1", name: "Residential", lines: [
    "The present house was built in 1995-96 when the Stephens Car Breakers site was redeveloped.",
    "~ In the 1980s, Breakspear Hospital for Diagnostic Medicine, Allergy and Environmental Medicine was recorded as 1 High Street but was better known as Langley House and did not refer to the present property.",
    "Part of D. Stephens, Motor Car Breakers at 7 and 9a (1966-1988)",
    "A. Law, High Class Boot and Shoe Repairs (1949-1958) {1,2,3}"] },
  { group: "south-side", no: "3", name: "Residential", lines: [
    "Originally a single-storey house"] },
  { group: "south-side", no: "5", name: "Residential", lines: [
    "School teachers’ house"] },
  { group: "south-side", no: "7", name: "Residential", photos: pair("07"), lines: [
    "D. Stephens, motor car breakers (1966-1990) {3,4}",
    "Mrs Winifred Gardener, Sweet Shop (1956-1962) {3,5}",
    "Miss Mary Mead, confectioner: Sweets and Bread shop (1921-1956) {3,6,7,8}"] },
  { group: "south-side", no: "9", name: "Residential", lines: [
    "Part of D. Stephens, motor car breakers (1968-1990)",
    "Albert Gardener, Tailor (1947) {3}",
    "George Layfield (Grocer) resident here (1851-1871)"] },
  { group: "south-side", no: "9a", name: "Residential", lines: [
    "D. Stephens, motor car breakers (1968-1990) {2,4}",
    "Mrs P. Johnson (Marie Ann Ladies Hairdressers) (1966-67) {3}",
    "Harold Stephens, Ladies’ Hairdresser (1947-1964) {3,8}",
    "Ethel Stephens, Ladies’ and Children’s Hairdresser (1934-1941) {3}",
    "Charles John Austin (branch of), Grocers (1886-1918) {3} (Manager: J.W. Hart) {6}",
    "George Layfield, Grocer, Cheesemonger and Post Office (1851-1871) {3,6}"] },
  { group: "south-side", no: "11", name: "Residential", lines: [] },
  { group: "south-side", no: "13", name: "Residential", extras: [advert("13-advert")], lines: [
    "Arthur Harris, Private Cars for All Occasions (1933-1954) {3}"] },
  { group: "south-side", no: "15", name: "Residential (1975-present)", lines: [
    "Mary Busby, Undertaker/Funeral Director {2} (1947-1974) {3}",
    "Benjamin Busby, Builder (1931-1958) {3}",
    "Homer Busby, Builder and Undertaker (1875-1929) {9}",
    "Joseph Chalk, Builder (1838-1874) {3}",
    "Abbots Langley Parish Workhouse (until 1832) {9}"] },
  { group: "south-side", no: "17", name: "The Village Barbers", osm: "node/2422174408", lat: 51.707555, lng: -0.416190, lines: [
    "1995-present {9}, operated by Christine Cripps, then Paul Blayney, now Lindy Bushby",
    "Heathers flowers, Valerie King (1990-1995)",
    "Abbots Tool Hire, Alan Rose (1985-1990)",
    "Sewing Box Haberdashery, Dorothy Osler (1978-80), Marion Frank (1980-82), Heather Moyes (1982-85)",
    "Wholesale meat packer, Stuart East/Mills (1975-1978)",
    "Simons (Butchers), 1826-1974 {3}",
    "J. Clarke (Butcher), early 19th century {8}",
    "G. Harding (Butcher), late 18th century {10}"] },
  { group: "south-side", no: "19", name: "Residential", lines: [
    "Joint hereditament with shop at no.17"] },
  { group: "south-side", no: "21", name: "The Boys Home Public House", featured: true, photos: pair("21"), osm: "way/218815409", lat: 51.707397, lng: -0.416173, lines: [
    "Previously “The Rose and Crown” Public House (name changed by David Allery in 1980s)",
    "And previously “The Middle House” (late 19th century)",
    "Grocery and Provision Shop (proprietress: Mrs Martha Hills) {6}, 1886-1899 {3,11}",
    "Mrs Jane Lunnon (1881-1882), Beer seller and shopkeeper {3,6}",
    "Built in 1850 on land owned by Mr Thomas Ebburn (canal haulier/coal, Apsley Wharf)"] },
  { group: "south-side", no: "23", name: "Residential", lines: [
    "Known as Alban Cottage in 1897"] },
  { group: "south-side", no: "25", name: "Residential (Harvest House)", lines: [] },
  { group: "south-side", no: "27", name: "Residential", lines: [
    "Mrs Miller stored antiques and furniture (1960s-2019)",
    "David Gibbs, Bakers Shop and Bakery: Bakers, Confectioners, Corn Dealers (1825-1938) {1,3}"] },
  { group: "south-side", no: "29", name: "Residential", lines: [
    "Calvert (photographer in 1920s) {6}",
    "Built in 1850s"] },
  { group: "south-side", no: "31", name: "Residential", lines: [
    "Charles Harris, boot repairs and parish clerk in 1922, 1937; 1886-1938 {3}",
    "Built in 1850s"] },
  { group: "south-side", no: "33", name: "Cottage", lines: [
    "Demolished in 1960s when King’s Head Public House rebuilt and road straightened."] },
  { group: "south-side", no: "35", name: "Pin Wei", featured: true, photos: pair("35"), osm: "way/232832789", lat: 51.706989, lng: -0.416297, lines: [
    "Oriental restaurant, closed 2023",
    "The Kings Head PH (1756-2006) {12}",
    "~ Original building close to the road demolished in 1960s and replaced with a flat-roof structure set back behind the car park"] },
  { group: "south-side", no: "37", name: "Car Park", lines: [
    "Part of Pin Wei car park",
    "Norman E Smith, garage and motor engineer (1940-47)",
    "Balmer & Longhurst (1937-38) {3}",
    "Reg Allery, garage (1935-36) {3}",
    "W.E. Havart: The King’s Head Garages (cars stored, cleaned, and cared for) (1930)",
    "F.A.S. Perry: Frank Perry also an Estate Agent (1929-1931) {2}",
    "McKee’s, Petrol Garage and Car Hire (1926-27) {3}; Arthur Harris, car hire (1929-34) {1}",
    "Mitchell’s, forge and blacksmith’s (1908-1924) {3}",
    "Busby’s, builder’s yard (who rented from Cannon Brewery) {22}"] },
  { group: "south-side", no: "39 & 41", pin: "39", name: "Cinnamon Lodge Indian Restaurant (A. Chowdhury)", featured: true, photos: pair("39"), extras: [advert("41-advert")], osm: "node/2399910269", lat: 51.706857, lng: -0.416591, lines: [
    "# No. 39",
    "Forest of India, Indian restaurant",
    "Peony Garden, Chinese Restaurant",
    "R.A. Liberty: The Hardware Stores (1964-1989) {4}, absorbed into no.41 in late 1960s",
    "G.C. Blackwell & Sons, grocers (1962-66) {3}",
    "P. and D.E. Kirby’s, grocers (1952-1960) {3}",
    "Norman’s Grocers (1949-1951) {1}",
    "Wm Fred. Peel, Grocers (1933-1947) {3}",
    "Skinner, John J., Cold meats and Grocer (1932) {3}",
    "Mrs Lizzie Wright, homeware, lampshades, etc. (1926-1929) {22}",
    "Built in 1920s on site of Busby’s builder’s yard, which was rented from the Cannon Brewery",
    "# No. 41",
    "Forest of India",
    "Peony Garden Chinese Restaurant",
    "Raymond Liberty, The Hardware Stores (1964-1989) {3,13}",
    "Leonard W. and Mrs Doris Luck, Hardware and Ironmongery (1936-1964) {3}",
    "Harold W. Gravestock, Butcher (1932-35) {3}",
    "Frederick Luck, Hardware (1929) {3}",
    "Charles Quarterman, Hardware dealer (1927) {3}",
    "Built in 1920s on site of Busby’s builder’s yard, which was rented from the Cannon Brewery"] },
  { group: "south-side", no: "43", name: "Peony Garden Chinese Takeaway (Tim Cheng)", osm: "node/9684360653", lat: 51.706783, lng: -0.416618, lines: [
    "Happy Gathering Chinese Takeaway and Restaurant (1988) {4}",
    "Greengrocers, Mr and Mrs Jim Chapman (1949-78) {4}",
    "Greengrocers & Fruiterers, L. Hall (March 1936-1947) {2,3}",
    "Greengrocers & Fruiterer, Ellen Streete (1927-1936) {3}",
    "Built in 1920s on site of Busby’s builder’s yard, which was rented from the Cannon Brewery"] },
  { group: "south-side", no: "45", name: "Abbey Pharmacy (A & R Fisher Ltd.)", osm: "node/2399910264", lat: 51.706750, lng: -0.416628, lines: [
    "Vantage Abbey Pharmacy (Pharmacist: ??)",
    "Boots, chemist (1960-1974)",
    "Sheffield’s, electrical suppliers (1947-57) {1,2}",
    "Curzon’s (Robert Ford), grocers (1926-1939) {3,14}",
    "Built in 1920s on site of Busby’s builder’s yard, which was rented from the Cannon Brewery"] },
  { group: "south-side", no: "47", name: "San Giorgio Pizza Restaurant", osm: "node/2399910289", lat: 51.706703, lng: -0.416645, lines: [
    "Simon East, butchers (1980-2022) {22}",
    "JD Meats (1977-1980)",
    "Mills Meat (1972-1977)",
    "Calton Bakery (1972-1974)",
    "Rye’s Bakery (1967-1972) {15,22}",
    "Express Dairy Shop (1960-1966) {15}",
    "Boots Chemist (1950-1960) {15}",
    "Ernest Thompson, Chemist (1949) {3}",
    "Samuel Gray Fenton’s, Chemist (1927-1947) {14}",
    "Built in 1920s on site of Busby’s builder’s yard, which was rented from the Cannon Brewery"] },
  { group: "south-side", no: "49", name: "San Giorgio Pizza Takeaway (Laura and Genaro Depiano)", photos: pair("49"), osm: "node/2399910277", lat: 51.706655, lng: -0.416661, lines: [
    "Breaktime",
    "Bill the Baker",
    "Milly’s the bakers",
    "Topham’s bakery",
    "Mansbridge’s bakers (1989-??)",
    "~ Greek developer purchased lease of shop and flat: 1987-90",
    "Doret (proprietress: Mrs Margery Heap) (1986-87) {22}",
    "Doret (proprietress: Mrs Margaret Heudebork) (1975-86) {22}",
    "Doret (proprietress: Mrs Margery Heap) (1970s)",
    "Doret, Ladies’, Children’s and Babies’ wear (proprietress: Mrs E.M. Chapman) {5}",
    "Doret, Ladies’, Children’s and Babies’ wear (proprietress: Miss P. Luck) (1926-1942) {3}",
    "Built in 1920s on site of Busby’s builder’s yard, which was rented from the Cannon Brewery"] },
  { group: "south-side", no: "51", name: "M.K. Ginder & Sons (Funeral Directors)", extras: [advert("51-logo", "M.K. Ginder & Sons"), advert("51-advert")], osm: "node/2399910271", lat: 51.706609, lng: -0.416677, lines: [
    "The Body Shop, Health and Beauty Salon; gym upstairs",
    "Dennis Dobson, Barber and Hairdresser (after 1960)",
    "Bon-Bon, Confectioner, toys and stationers: proprietors: L.R. and E. Lyons (1949-1973) {3}",
    "Miss Mabel Luck, Confectioner (1928-1947) {1}, Miss M.M Luck 1927-37 {3}",
    "Built in 1920s on site of Busby’s builder’s yard, which was rented from the Cannon Brewery"] },
  { group: "south-side", no: "53", name: "Underground Barbers", osm: "node/2399910268", lat: 51.706553, lng: -0.416660, lines: [
    "Desire & Design, and Storey’s Removals at rear",
    "Dobson’s Antiques, House Clearance, Junk shop (1976, 1980, 1988) {4}",
    "Barbers and Hairdressers, Den Dobson and Fred Dobson (from 1960 …)",
    "Barbers and Hairdressers, Arthur Dobson (1926-1974) {16}",
    "Built in 1920s on site of Busby’s builder’s yard, which was rented from the Cannon Brewery"] },
  { group: "south-side", no: "55", name: "Number unused", lines: [
    "The Crescent was built on the Langley House plantation in 1930s"] },
  { group: "south-side", no: "57 & 59", pin: "57", name: "Sweeney’s (together with Morrisons)", osm: "way/218952090", lat: 51.706265, lng: -0.416699, lines: [
    "Budgens",
    "Bishops supermarket (built in 1963 on part of the Langley House “plantation”)"] },
  { group: "south-side", no: "61", name: "Boots Pharmacy", featured: true, photos: pair("61"), extras: [advert("61-advert")], osm: "node/2399943061", lat: 51.706196, lng: -0.416885, lines: [
    "Moss’s Pharmacy",
    "John Tapster’s chemist (1976, 1980, 1988) {4} (Mr Tapster retired ????)",
    "Kinloch and Anderson (1956-76) {3}",
    "John Kinloch, Chemist (1949-1954) {3}",
    "Luckett’s, electrical supplies (1949) {3}",
    "H.E. (Jock) Wright, electrical store/post office (1929-1948) {1,22}"] },
  { group: "south-side", no: "63", name: "Unique Nails and Beauty", osm: "node/2399943065", lat: 51.706140, lng: -0.416941, lines: [
    "Lloyds Bank (1968-2020) {1}",
    "A.J. Midgley, footwear (1962-1969) {3}",
    "John Lea, Boots and Shoes, repairs (1927-1960) {3}"] },
  { group: "south-side", no: "65", name: "Sheffield’s Euronics", extras: [advert("65-drawing", "Sheffields, drawing by Prue King (the directory’s cover)")], osm: "node/2399943068", lat: 51.706085, lng: -0.416996, lines: [
    "H.F. Sheffield Ltd. (1958-current)"] },
  { group: "south-side", no: "67", name: "Signature Estates (2013-present)", osm: "node/2399943062", lat: 51.706031, lng: -0.417050, lines: [
    "Craft Tub (2010-2013) {22}",
    "Sheffield’s showroom and toy shop (1962-2010) {3}"] },
  { group: "south-side", no: "69", name: "Over the Moon", extras: [advert("69-logo", "Over the Moon")], osm: "node/2399943066", lat: 51.705976, lng: -0.417104, lines: [
    "Lynn Luck 2008-2017; Melissa Lee 2017-present",
    "Abbots Langley Flowers, Lynn Luck (2003-2008) {22}",
    "Heather’s Flowers (1995-2003)",
    "P. Kingston, butchers (1971-1994) {4}",
    "F.W. Grigson & Co., butcher (1967-1970) {3}",
    "R. Norman and Sons, butcher (1949-1966) {3}",
    "H.W. Gravestock and Son, butcher (1936-1942) {1}"] },
  { group: "south-side", no: "71-79", name: "Residential Cottages", photos: [IMG + "71-79-then.jpg"], lines: [] },
  { group: "south-side", no: "", name: "Adrian House, Residential", lines: [
    "“Adrian Villa”, Dr Frank Poole (1945-1964) {3}",
    "“Adrian Villa”, Dr Thomas Conn Britton, Physician & Surgeon, b.1887 in County Tyrone, d.1957 in Abbots Langley. (1922-1937) {3} (1920-1945) {1}",
    "“Adrian Villa”, Dr Sydney Hartill (1911 census, 29 years old, b. St Giles parish, Willenhall, Staffs. 1882, d. Stroud 1964). In partnership with Dr Frederick C. Fisher of Kings Langley {3}",
    "Conservative Club (1888-1895) {3}"] },
  { group: "south-side", no: "81", name: "Glossary Hair Company", featured: true, photos: pair("81"), extras: [advert("81-advert")], osm: "node/2441481442", lat: 51.705083, lng: -0.418191, lines: [
    "1994 to present",
    "Therapy Zone Beauty Parlour, behind hairdresser (corner with Adrian Road)",
    "Pro Cut hairdressers (2008-2010)",
    "The Cutting Garden, Hairdressers (1990s)",
    "Destroyed by fire and rebuilt …",
    "Butterfly Bridal and Evening Wear {13} (1988-1989)",
    "Sprintz Dress Shop and Café {22}, 1980s",
    "Jeanne’s Pantry, 1980s",
    "M. Burns, Decorators’ Merchant {4}",
    "R.A. Roberts, paint suppliers (1969-1976) {4}",
    "Line’s (run by Ron Sumner), grocers (1962-1967)",
    "E.A. Pine, grocers (1947-1960) {1,3}",
    "Jeanne Burn’s, grocers, cakes and confectionery (1927-1947)",
    "Emma Bligh, draper (1899-1927)",
    "Mrs Lydia Cannon, draper (1880s-1900) {8}"] },
  { group: "south-side", no: "83-85", name: "Residential Cottages", lines: [] },
  { group: "south-side", no: "87", name: "Vine House Surgery", lines: [
    "Established by Drs Tomson, Hayden, Dyer, Mawson, … in 1963 {1}",
    "Registry of Births, Deaths, and Marriages {17}"] },

  // ---- Langley Parade, formerly "Creasy's Parade" ----
  { group: "langley-parade", no: "1", name: "Deli Coffee House", osm: "node/2399943063", lat: 51.705929, lng: -0.417152, lines: [
    "That Little Coffee Shop",
    "The Crazy Goat",
    "Deli Licious",
    "Video hut (Sam)",
    "Co-op butchers (joined to Co-op grocers, earlier known as 71a High Street) (1938-1992/3)"] },
  { group: "langley-parade", no: "2", name: "Langley Vets", extras: [advert("lp2-banner", "Langley Vets")], osm: "node/2399943067", lat: 51.705886, lng: -0.417177, lines: [
    "Abbots Flooring (??-2024)",
    "Seasons Wines",
    "Off-licence, The Local",
    "Victoria Wine",
    "W.G. Peters, Wine Shop (1982)",
    "Co-op grocers (joined to Co-op butchers, originally 71 High Street) (1938-??)"] },
  { group: "langley-parade", no: "3", name: "The Hospice of St Francis Shop", osm: "node/2399943069", lat: 51.705827, lng: -0.417186, lines: [
    "The Wine Shop off-licence (1989-90) (Mrs David Miller) {22}",
    "Barclay’s Bank (temporary, built in 1970)"] },
  { group: "langley-parade", no: "4", name: "Dolphin Fish Bar", extras: [advert("lp4-advert")], osm: "node/2399943064", lat: 51.705762, lng: -0.417175, lines: [
    "Red Herring Fish Bar, fish and chip shop",
    "Godman and Tonge, fish and chip shop (1971-??)",
    "Godman, fish and chip shop (1958-1970)",
    "E. Dowse, fish shop (“Hygienic Fishery”) (1933-1958) {3}"] },
  { group: "langley-parade", no: "5", name: "Taylor Rose", osm: "node/2399943070", lat: 51.705716, lng: -0.417144, lines: [
    "Signature Estate Agent",
    "Duo, Barbers",
    "Elwood’s, shoe mender, cobblers (1952-87)",
    "Jackman’s, shoe shop (1938-1947)"] },
  { group: "langley-parade", no: "6", name: "Abbots Tandoori (1989-)", osm: "node/2399943060", lat: 51.705687, lng: -0.417123, lines: [
    "P.J. Condon, Grapevine greengrocers (1969-1988)",
    "Eric Curtis, greengrocers (1940-1969) {1,3}"] },
  { group: "langley-parade", no: "7", name: "Abbots Home and Garden", osm: "node/2399943058", lat: 51.705641, lng: -0.417091, lines: [
    "~ In 1976 Parish Guide this was recorded as 4 Langley Road",
    "Abbots Home and Garden/Langley Home and Garden (from 1966), Parish Guide 1971, 1976",
    "Abbots Langley Café-Lounge (1937-1964) {3}"] },
  { group: "langley-parade", no: "8", name: "Abbots Supermarket", osm: "node/2399943059", lat: 51.705578, lng: -0.417048, lines: [
    "Carpet Rack (1992-??)",
    "Meehan’s Bakers (1989-1992)",
    "C.Creasy, bakers (1938-1989), (1937-1989) {1,17}",
    "George Broadribb (1936) {3}",
    "Gage’s Bakers Shop (1935) {3}"] },

  // ---- Even numbers: north-west side of High Street ----
  { group: "north-side", no: "2 & 4", pin: "2", name: "The Library", osm: "way/220078366", lat: 51.708267, lng: -0.416275, lines: [
    "Opened 1982",
    "Old cottages demolished in 1960s to straighten the road.",
    "# No. 2",
    "William Sharp, Taxi Service",
    "Walter Sharp, laundry (1932-1949) {3}",
    "William Crew, tailor (in Combe Charity Cottages) (1832-1855) {3}",
    "# No. 4",
    "John Bonaker {6}, Saddler (1841-??), Registrar (1854-1888) {1}",
    "Other half of Combe Charity Cottages"] },
  { group: "north-side", no: "6", name: "The Old Vicarage", photos: pair("06"), lines: [
    "Formerly The Vicarage to 2015",
    "Adjoins the Citizens Advice office (in the Stable Block)",
    "Adjoins St Lawrence Parish Church {18}",
    "Occupied by the Vicar of St Lawrence Church from 1700s until 2015"] },
  { group: "north-side", no: "8", name: "Residential (now 1 & 2 St Lawrence Close)", lines: [
    "Glebe Cottage (Curate’s House), built in 1850s; demolished in 1966"] },
  { group: "north-side", no: "10", name: "Residential, “The Abbots House”", lines: [
    "Current owner: The Mitchells",
    "Previous owners: Dr and Mrs Peter Tomson (1956-202?) (gardens opened for charities)",
    "Garden nursery in 1990s",
    "Doctor’s Surgery: Drs Tomson, Fisher, Brown and Mawson (1956-1967) {3}"] },
  { group: "north-side", no: "12", name: "The Village Tandoori", featured: true, photos: pair("12"), extras: [advert("12-advert")], osm: "node/2399910280", lat: 51.706823, lng: -0.416856, lines: [
    "Sweet Sensation sweet shop (1992)",
    "The Flower Shop (1991)",
    "New Vision Satellite TV (1989)",
    "Second Chance (1988-March 1989)",
    "Kelvinator Launderama 1971, 1972 {4}",
    "Ryland’s drapers, manager: Madge Bateman (1953-1970) {17,22}",
    "Wm. Hill (Proprietress: Mrs E.H. Honess), Drapery, Clothing and Boot Store",
    "William Hill, Men’s and Boy’s clothing, American boots and shoes, ladies boots…",
    "~ (a double shop occupying both 12 and 12a) (1886-1952) {3}"] },
  { group: "north-side", no: "12a", name: "Beautiful You", osm: "node/2399910267", lat: 51.706778, lng: -0.416864, lines: [
    "GA Property Management",
    "Bentley’s estate agent",
    "Girl Friday Boutique (1970-1976) {2}",
    "Suzanne’s Florists (1968-1969) {3}",
    "O. B. Ryland Ltd., drapers 1956 {3}, Madge Bateman was manageress {17}",
    "~ See no. 12 above. 12a had been the front garden of no.12 and was part of Wm Hill’s.",
    "Wm. Hill (Proprietress: Mrs E.H. Honess), Drapery, Clothing and Boot Store",
    "William Hill, Men’s and Boy’s clothing, American boots and shoes, ladies boots…",
    "~ (a double shop occupying both 12 and 12a) (1886-1952)"] },
  { group: "north-side", no: "14", name: "Proffitt and Holt Partnership, Estate Agents", osm: "node/2399910275", lat: 51.706721, lng: -0.416874, lines: [
    "Kelly and Nichols, solicitors; Kelly Nichols Blayney (1989)",
    "Langley Insurance Consultants (1972) {2}",
    "~ Present premises built on front garden of no.14, see above."] },
  { group: "north-side", no: "16", name: "Crown Barbers", featured: true, photos: pair("16"), osm: "node/2399910281", lat: 51.706670, lng: -0.416883, lines: [
    "Your Move, Estate Agent and the Leeds Building Society",
    "Weller, Hill & Hubble, estate agents (Leeds Permanent BS) (1980) {4}",
    "Bud-Jet flight shop {1}",
    "Post Office and sweater shop, Mrs Bernard & Lavinia Shaw (1966-74) {3}",
    "Post Office, Jock Wright (1948-1964) {1}",
    "A. Evans, Fishmonger, Poulterer, Fruiterer, Greengrocer, “Est. 1866” (1933-1938) {3}",
    "A.W. Cave (& Son from 1927), Fishmonger and Poulterer (1886-1932) {1}"] },
  { group: "north-side", no: "18", name: "Alexandra Jewellers", featured: true, photos: pair("18"), osm: "node/2399910265", lat: 51.706635, lng: -0.416892, lines: [
    "Est. 2016",
    "Velvet",
    "GA Estate Agents",
    "Budget Travel",
    "Mastic Pointing Service (1989)",
    "Victor D. Hall Opticians (1974-??)",
    "Harrison Optician (1967-1972) {3}",
    "K. Appel, Optician (1966)",
    "Doctors, WE and EG Haydon (1956-1966) {1,3,5}",
    "Post Office, Grocer and Draper, Mr. Thomas Turner and his daughters (1870-), Miss B. Turner (1926-27) {3}"] },
  { group: "north-side", no: "20", name: "Noor Mahal", featured: true, photos: pair("20"), extras: [advert("20-advert")], osm: "node/2399910278", lat: 51.706576, lng: -0.416924, lines: [
    "The Viceroy of India (1989-??)",
    "Langley Foods (1966-1989) {13}",
    "Waitrose store (1962-1966) {19}",
    "Henry Kingham and Sons, grocers (1921-1962) {1}",
    "Seabrook’s grocery & provision store {3}, manager: W. Cooper (1909) {8}",
    "Abbots Supply Stores, Mr. Daniel Seabrook (1890-1926) {3}"] },
  { group: "north-side", no: "22-26", pin: "24", name: "Morrisons Daily", extras: [advert("24-advert")], osm: "node/2399910272", lat: 51.706478, lng: -0.416994, lines: [
    "# No. 24",
    "Martins News Agents {5,22}",
    "Martin McColl",
    "Lewis Meeson Newsagents (1986) {20}",
    "A. Lewis & Co. Ltd. (1971-1980s) {3}",
    "F.H. Dazeley & Son, Newsagents, Booksellers, Stationers, Tobacconists (1911-1967)",
    "Thomas Carter, News Agent and Stationer (1902-1908) {3}",
    "# No. 22, part of the newsagents at no. 24 since 1960s",
    "Ernest Joseph Funnell {5}, Boot maker and repairer (1906-1952) {1,3}",
    "Agnes Oliver, Boot shopkeeper (1899-1902)",
    "# No. 26, part of the newsagents at no. 24 since 1950s",
    "Martin McColl",
    "Lewis Meeson Newsagents (1986) {20}",
    "A Lewis & Co Ltd",
    "Dazeley & Sons",
    "P.H. Cox, Baker & Confectioner (1906-1912) {3,7,11}"] },
  { group: "north-side", no: "28", name: "Ansell’s Betting Service", osm: "node/2399910266", lat: 51.706423, lng: -0.417050, lines: [
    "Since 1972 (Est. business 1920)",
    "Previously residential (Mr and Mrs Dazeley lived there) {5}",
    "Lewis Wm Trapp, Boot repairer {6,21}, (1890-1931) {1,3}"] },
  { group: "north-side", no: "30 & 32", pin: "32", name: "Haart Estate Agents and Village Café", featured: true, photos: pair("30-32"), extras: [advert("32-advert-glenister"), advert("32-advert-millers")], osm: "node/2399910279", lat: 51.706348, lng: -0.417125, lines: [
    "# No. 30, Haart Estate Agents",
    "Spicer McColl, Estate Agent",
    "Cornerstone (Abbey National estate agency brand) (1988-1994)",
    "Gordon Hudson Estate Agent (1987-1988)",
    "George Hill and Hubble, Estate Agent (1968-1974)",
    "Lloyds Bank (1914-1968) {3}",
    "# No. 32, Village Café",
    "Mangiamo Pizza (2005) {16}",
    "Greengrocers (Langley Fruiterers), Ian McKinnon (Breakspear Place)",
    "Carpet Rack (1987-1992)",
    "Millers, confectioners, Carters & Unwin seeds, Lyons Maid Napoli ice-cream (1958-1986) {3}",
    "Edwin Glenister, Builder (1922-31); greengrocer (1922-31), groceries, seeds, and sweets {3} (1886-1960) [Jessie Glenister in 1926 and 1937]"] },
  { group: "north-side", no: "34", name: "Perception Male Grooming", osm: "node/2399910270", lat: 51.706295, lng: -0.417179, lines: [
    "Langley Travel (1974-??)",
    "Kelly Nichols (at 34a HS), solicitors (1971-74) {3}",
    "Clive Barnett Associates, Chartered Surveyors/Estate Agent (1971-72) {4}",
    "Bricklayers Arms, public house (1878-1966)",
    "Site was a pond in 1867 {9}"] },
  { group: "north-side", no: "36", name: "Luxury Nails", osm: "node/2399910276", lat: 51.706259, lng: -0.417215, lines: [
    "Swifts dry cleaners (1970-??)",
    "Bricklayers Arms, public house (1878-1966)",
    "Site was a pond in 1867"] },
  { group: "north-side", no: "", pin: "HH", name: "Henderson Hall (built 1902)", photos: pair("hh"), osm: "way/219176339", lat: 51.706187, lng: -0.417445, lines: [
    "Parish Room and County Library (1936-1940) {3}"] },
  { group: "north-side", no: "38 & 38a", pin: "38", name: "La Banq", extras: [advert("38a-sign", "La Banq")], osm: "node/2399601576", lat: 51.706058, lng: -0.417455, lines: [
    "# No. 38",
    "Barclays Bank (1912, rebuilt in 1960s)",
    "Harry George Linforth, Hairdresser & Tobacconist (1906-11) {3,6}",
    "D.E. White, saddler and ironmonger",
    "John, Hannah and Hugh Bonaker, saddler (1851-1908) {3}",
    "# No. 38a",
    "Chalkley’s dairy and tea shop (1921-1960) {1}",
    "Coldman’s dairy (1878)"] },
  { group: "north-side", no: "40", name: "Katie’s Hairshare", osm: "node/2399601577", lat: 51.705998, lng: -0.417523, lines: [
    "Rolando’s",
    "Etiquette Ladies Hairdressers",
    "Reflections Hair Design (1988 {4}), Heather Wells",
    "Sun and Hair Hairdresser, Robert Alexander {22}",
    "Hairset, ladies’ hairdresser, Jean Slater (1971) {4}"] },
  { group: "north-side", no: "42", name: "Post Office (Manish the Elder, Manish the Younger) {22}", osm: "node/2422174402", lat: 51.705982, lng: -0.417618, lines: [
    "S.R. (Rod) Hancock, post office (PO) and greengrocer (1971, 1976, 1980, 1988), (1994) {4,20}",
    "W. Kay, dentist in the house on corner with Abbots Road",
    "Mr Fossey, dentist {1}",
    "John Haughton Threlfall, dentist in 1937 Kelly Directory",
    "“The Limes”, a house built by Homer Busby for William Hill (Draper)"] },

  // ---- Causeway Parade, built in 1958 ----
  { group: "causeway-parade", no: "70", name: "Simmons Bakers", osm: "node/5718150129", lat: 51.705824, lng: -0.417867, lines: [
    "Treasure Box",
    "Zodiac (1984-??)",
    "Valerie Fay, men’s, ladies’, and children’s wear (1980-1983) {4}",
    "D. and N. Goodman, men’s ladies’ and children’s wear, haberdashery (1976-1979 parish guide adverts)",
    "D. Tilbury, outfitters (1972-1974)",
    "Christie’s, Gentlemen’s and children’s outfitters (1960-1971) {3,4}"] },
  { group: "causeway-parade", no: "72", name: "Leith Opticians", osm: "node/2399492372", lat: 51.705783, lng: -0.417924, lines: [
    "J.B. Richards, optician (1972-73) {3}",
    "Mr Hall, optician (1960-1971) {3}"] },
  { group: "causeway-parade", no: "74", name: "Garston TV and Radio Service (Steve Davis)", osm: "node/2399492374", lat: 51.705739, lng: -0.417984, lines: [
    "Mr and Mrs A Davis, TV and Radio shop (1960-current) {3}"] },
  { group: "causeway-parade", no: "76", name: "Full Moon Chinese Take-away", osm: "node/2399492373", lat: 51.705695, lng: -0.418042, lines: [
    "Abbots Pet Food Supplies (1988-) {13,20}",
    "Victoria Wine (1960-??)"] },
  { group: "causeway-parade", no: "78", name: "Abbots Langley Pharmacy", osm: "node/2399492376", lat: 51.705651, lng: -0.418102, lines: [
    "Way Ahead, Hair dressers",
    "Charles, Ladies’ Hairdresser (1962-??)",
    "Josephine, Ladies’ Hairdressers (1960-62)"] },
  { group: "causeway-parade", no: "80", name: "Vape Shop", osm: "way/218952091", lat: 51.705579, lng: -0.418279, lines: [
    "Tattoo No Saint",
    "Public toilets"] },
  { group: "causeway-parade", no: "", pin: "G", name: "The Grange, Residential (built 1986)", photos: pair("grange"), extras: [advert("grange-dairy", "Express Dairy vans")], osm: "way/219228108", lat: 51.705272, lng: -0.419230, lines: [
    "E.W. Flowers (front of site), Petrol and Garage Repairs (1958-1983) {3}",
    "Express Dairy Depot (rear of site)",
    "Manor House outbuildings"] },
  { group: "causeway-parade", no: "", name: "Manor Lodge Police Station", lines: [
    "County Library (until 1982)",
    "Manor House billiards room"] }
];
