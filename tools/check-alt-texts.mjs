import fs from 'fs';

const data = fs.readFileSync('C:\\Users\\DELL\\OneDrive\\Desktop\\FRCC RESORTS &STAYS\\tools\\pexels-pool.json', 'utf8');
const json = JSON.parse(data);

const checkIds = ['33803734', '19219055', '19517376', '8082328', '32334284', '31474676', '29000046', '18269733', '30479386', '14841129', '37729825', '34496715', '39205259', '39205253', '3011575', '18649226', '36644768', '19026489', '16094034', '19810875', '27206543', '33819401', '261102', '2291619', '11984085', '33647166', '27274134', '30560236', '18435555', '33561756', '2771935', '37526152', '29038821', '9119782', '35769254', '37182539', '668300', '29000046', '31474676', '28238364', '34496701', '40156183'];

Object.keys(json).forEach(cat => {
  if (json[cat] && Array.isArray(json[cat])) {
    json[cat].forEach(item => {
      if (checkIds.includes(item.id)) {
        console.log(cat + ': ' + item.id + ' - ' + item.alt.substring(0, 100));
      }
    });
  }
});