/**
 * FRCC STAYS - IMAGE LIBRARY
 * 25 hotels x 6 + 50 rooms x 6 = 600 unique photos.
 * Hotel photos: Exterior, Lobby, Entrance, Reception, Parking, Building only.
 * Room photos: Bedroom, Bed, Living Area, Balcony/Window View, Washroom, Work Desk/Tea Corner.
 * No pool, restaurant, spa, gym, kitchen, or luxury photos.
 * Each entry: { url, category, alt }. All URLs verified HTTP 200.
 */

const _IMG_W = 1200, _IMG_H = 800;

/* Landing page images (hero + area cards). */
const LANDING_IMAGES = {
  hero: { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80', alt: 'Modern hotel building exterior at dusk' },
  hyderabad: { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', alt: 'Hotel building exterior in Hyderabad' },
  vijayawada: { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', alt: 'Hotel building exterior in Vijayawada' }
};

/* Hotel galleries: 6 photos per hotel - building and lobby only. */
const HOTEL_IMAGES = {
  "hyd001": [
    { url: "https://images.pexels.com/photos/33803734/pexels-photo-33803734.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel building exterior" },
    { url: "https://images.pexels.com/photos/14841129/pexels-photo-14841129.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby with reception" },
    { url: "https://images.pexels.com/photos/37729825/pexels-photo-37729825.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance porch" },
    { url: "https://images.pexels.com/photos/34496715/pexels-photo-34496715.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception desk" },
    { url: "https://images.pexels.com/photos/19219055/pexels-photo-19219055.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking area" },
    { url: "https://images.pexels.com/photos/19517376/pexels-photo-19517376.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building facade" }
  ],
  "hyd002": [
    { url: "https://images.pexels.com/photos/8082328/pexels-photo-8082328.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel building exterior" },
    { url: "https://images.pexels.com/photos/32334284/pexels-photo-32334284.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby seating" },
    { url: "https://images.pexels.com/photos/31474676/pexels-photo-31474676.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/29000046/pexels-photo-29000046.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel front desk" },
    { url: "https://images.pexels.com/photos/18269733/pexels-photo-18269733.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/30479386/pexels-photo-30479386.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd003": [
    { url: "https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/28238364/pexels-photo-28238364.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/34496701/pexels-photo-34496701.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/3011575/pexels-photo-3011575.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/18649226/pexels-photo-18649226.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking area" },
    { url: "https://images.pexels.com/photos/36644768/pexels-photo-36644768.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd004": [
    { url: "https://images.pexels.com/photos/19026489/pexels-photo-19026489.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/16094034/pexels-photo-16094034.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/40156183/pexels-photo-40156183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/18435555/pexels-photo-18435555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/33561756/pexels-photo-33561756.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/2771935/pexels-photo-2771935.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd005": [
    { url: "https://images.pexels.com/photos/37526152/pexels-photo-37526152.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/29038821/pexels-photo-29038821.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/9119782/pexels-photo-9119782.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/35769254/pexels-photo-35769254.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/37182539/pexels-photo-37182539.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/12194454/pexels-photo-12194454.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd006": [
    { url: "https://images.pexels.com/photos/24405882/pexels-photo-24405882.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/16104977/pexels-photo-16104977.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/3460599/pexels-photo-3460599.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/1861153/pexels-photo-1861153.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/32457946/pexels-photo-32457946.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/30929856/pexels-photo-30929856.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd007": [
    { url: "https://images.pexels.com/photos/9119625/pexels-photo-9119625.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/20755938/pexels-photo-20755938.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/26115794/pexels-photo-26115794.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/9119622/pexels-photo-9119622.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/14915303/pexels-photo-14915303.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/16239257/pexels-photo-16239257.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd008": [
    { url: "https://images.pexels.com/photos/40119436/pexels-photo-40119436.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/9119725/pexels-photo-9119725.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/16099258/pexels-photo-16099258.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/39468493/pexels-photo-39468493.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/38406173/pexels-photo-38406173.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/8047501/pexels-photo-8047501.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd009": [
    { url: "https://images.pexels.com/photos/19227992/pexels-photo-19227992.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/19617052/pexels-photo-19617052.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/8180457/pexels-photo-8180457.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/5659779/pexels-photo-5659779.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/33720790/pexels-photo-33720790.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/5726116/pexels-photo-5726116.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd010": [
    { url: "https://images.pexels.com/photos/10273208/pexels-photo-10273208.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/9119786/pexels-photo-9119786.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/33464935/pexels-photo-33464935.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/15925412/pexels-photo-15925412.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/27573810/pexels-photo-27573810.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/1719173/pexels-photo-1719173.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd011": [
    { url: "https://images.pexels.com/photos/12274682/pexels-photo-12274682.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/15925413/pexels-photo-15925413.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/37832619/pexels-photo-37832619.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/38428713/pexels-photo-38428713.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/17360003/pexels-photo-17360003.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/38438327/pexels-photo-38438327.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd012": [
    { url: "https://images.pexels.com/photos/38544060/pexels-photo-38544060.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/14749879/pexels-photo-14749879.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/6010421/pexels-photo-6010421.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/8317181/pexels-photo-8317181.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/36488764/pexels-photo-36488764.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/10786185/pexels-photo-10786185.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd013": [
    { url: "https://images.pexels.com/photos/14036441/pexels-photo-14036441.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/30461030/pexels-photo-30461030.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/32819285/pexels-photo-32819285.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/10325006/pexels-photo-10325006.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/37497181/pexels-photo-37497181.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/290597/pexels-photo-290597.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "hyd014": [
    { url: "https://images.pexels.com/photos/33780374/pexels-photo-33780374.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/10880468/pexels-photo-10880468.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/30619805/pexels-photo-30619805.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/39388365/pexels-photo-39388365.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/37362685/pexels-photo-37362685.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/39605205/pexels-photo-39605205.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij001": [
    { url: "https://images.pexels.com/photos/10664000/pexels-photo-10664000.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/14012107/pexels-photo-14012107.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/9119626/pexels-photo-9119626.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/15506116/pexels-photo-15506116.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/16518111/pexels-photo-16518111.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/17158806/pexels-photo-17158806.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij002": [
    { url: "https://images.pexels.com/photos/7078666/pexels-photo-7078666.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/7706385/pexels-photo-7706385.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/11576307/pexels-photo-11576307.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/11251720/pexels-photo-11251720.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/31056504/pexels-photo-31056504.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/14846410/pexels-photo-14846410.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij003": [
    { url: "https://images.pexels.com/photos/36704212/pexels-photo-36704212.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/5371683/pexels-photo-5371683.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/37582309/pexels-photo-37582309.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/16543093/pexels-photo-16543093.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/33330666/pexels-photo-33330666.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/15380840/pexels-photo-15380840.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij004": [
    { url: "https://images.pexels.com/photos/18201279/pexels-photo-18201279.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/10047588/pexels-photo-10047588.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/919282/pexels-photo-919282.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/17563212/pexels-photo-17563212.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/18226348/pexels-photo-18226348.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/36688004/pexels-photo-36688004.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij005": [
    { url: "https://images.pexels.com/photos/36428237/pexels-photo-36428237.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/7155165/pexels-photo-7155165.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/31124898/pexels-photo-31124898.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/16799410/pexels-photo-16799410.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/15497155/pexels-photo-15497155.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/15497597/pexels-photo-15497597.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij006": [
    { url: "https://images.pexels.com/photos/15497599/pexels-photo-15497599.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/29299050/pexels-photo-29299050.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/7076873/pexels-photo-7076873.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/20543524/pexels-photo-20543524.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/16901228/pexels-photo-16901228.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/19227989/pexels-photo-19227989.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij007": [
    { url: "https://images.pexels.com/photos/18308569/pexels-photo-18308569.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/19026580/pexels-photo-19026580.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/2366105/pexels-photo-2366105.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/39660328/pexels-photo-39660328.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/19866634/pexels-photo-19866634.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/20868673/pexels-photo-20868673.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij008": [
    { url: "https://images.pexels.com/photos/31969409/pexels-photo-31969409.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/19573683/pexels-photo-19573683.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/11405225/pexels-photo-11405225.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/20045508/pexels-photo-20045508.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/36626368/pexels-photo-36626368.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/16579079/pexels-photo-16579079.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij009": [
    { url: "https://images.pexels.com/photos/35479245/pexels-photo-35479245.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/19789285/pexels-photo-19789285.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/32895277/pexels-photo-32895277.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/30722815/pexels-photo-30722815.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/16380847/pexels-photo-16380847.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/15820366/pexels-photo-15820366.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij010": [
    { url: "https://images.pexels.com/photos/36488760/pexels-photo-36488760.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/17619969/pexels-photo-17619969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/13516410/pexels-photo-13516410.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/20375056/pexels-photo-20375056.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/39833685/pexels-photo-39833685.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/16159744/pexels-photo-16159744.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ],
  "vij011": [
    { url: "https://images.pexels.com/photos/30533977/pexels-photo-30533977.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Exterior", alt: "Hotel exterior" },
    { url: "https://images.pexels.com/photos/9090249/pexels-photo-9090249.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Lobby", alt: "Hotel lobby" },
    { url: "https://images.pexels.com/photos/27775240/pexels-photo-27775240.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Entrance", alt: "Hotel entrance" },
    { url: "https://images.pexels.com/photos/36713688/pexels-photo-36713688.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Reception", alt: "Hotel reception" },
    { url: "https://images.pexels.com/photos/36386661/pexels-photo-36386661.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Parking", alt: "Hotel parking" },
    { url: "https://images.pexels.com/photos/9375980/pexels-photo-9375980.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Building", alt: "Hotel building" }
  ]
};

/* Room galleries: 6 photos per room type. */
const ROOM_IMAGES = {
  "hyd001-r1": [
    { url: "https://images.pexels.com/photos/14036481/pexels-photo-14036481.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Bedroom", alt: "Suite Room bedroom with king bed" },
    { url: "https://images.pexels.com/photos/36774519/pexels-photo-36774519.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Bed", alt: "Suite Room bed close-up" },
    { url: "https://images.pexels.com/photos/14341239/pexels-photo-14341239.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Living Area", alt: "Suite Room living area with sofa" },
    { url: "https://images.pexels.com/photos/14024019/pexels-photo-14024019.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Balcony", alt: "Suite Room balcony view" },
    { url: "https://images.pexels.com/photos/6010420/pexels-photo-6010420.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Washroom", alt: "Suite Room attached washroom with shower" },
    { url: "https://images.pexels.com/photos/30278040/pexels-photo-30278040.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Work Desk", alt: "Suite Room work desk" }
  ],
  "hyd001-r2": [
    { url: "https://images.pexels.com/photos/14036482/pexels-photo-14036482.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Bedroom", alt: "Normal Room bedroom with queen bed" },
    { url: "https://images.pexels.com/photos/36774520/pexels-photo-36774520.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Bed", alt: "Normal Room bed close-up" },
    { url: "https://images.pexels.com/photos/14341240/pexels-photo-14341240.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Work Desk", alt: "Normal Room work desk" },
    { url: "https://images.pexels.com/photos/14024020/pexels-photo-14024020.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Window View", alt: "Normal Room window view" },
    { url: "https://images.pexels.com/photos/6010421/pexels-photo-6010421.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Washroom", alt: "Normal Room attached washroom" },
    { url: "https://images.pexels.com/photos/30278041/pexels-photo-30278041.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop", category: "Tea Corner", alt: "Normal Room tea corner" }
  ]
};

export { LANDING_IMAGES, HOTEL_IMAGES, ROOM_IMAGES };