// const puppeteer=require('puppeteer');
// async function scrapeProduct(url){
//     const browser =await puppeteer.launch({headless: false});
//     const page=await browser.newPage();
//     await page.goto(url);

//     const [el]=await page.$x('/\/*[@id="main-image"]');
//     const src=await el.getProperty('src');
//     // console.log(src)
//     const imageURL=await src.jsonValue();

//     const [el2]=await page.$x('/\/*[@id="productTitle"]');
//     const txt=await el2.getProperty('textContent');
//     // console.log(src)
//     const title=await txt.jsonValue();

    
//     const [el3]=await page.$x('/\/*[@id="adbl_bb_price"]/span/span[2]/span[2]');
//     const txt2=await el3.getProperty('textContent');
//     // console.log(src)
//     const price=await txt2.jsonValue();

//     console.log({imageURL, title, price}); 

//     browser.close();
// }
// scrapeProduct('https://www.amazon.com/Black-Swan-Second-Improbable-Robustness/dp/B07KRM6L52/ref=sr_1_1?crid=L554QD5SHO4A&keywords=the+black+swan+second+edition&qid=1694165344&sprefix=The+black+swan+second%2Caps%2C387&sr=8-1');


// const{default:puppeteer}=require('puppeteer');
// const { writeFile, readFile } = require('fs/promises')
// const { load } = require('cheerio')

// const main=async()=>{
//     const browser=await puppeteer.launch({
//         headless:false,
//         defaultViewport:{
//         height:1080,
//         width:1920,
//         },
//     });
//     const page=await browser.newPage();
//     await page.goto('https://www.amazon.in');
//     await page.type('#twotabsearchtextbox' , 'messi');
//     await page.keyboard.press('Enter');
//     await page.waitForTimeout(5000);

//     const messiproduct=[];
//     const $=load(await page.content());

//     $('.s-result-item').each((index, element) => {
//         const cr = $(element).find('.a-size-base-plus a-color-base').text().trim();
//         if (cr) {
//           messiproduct.push(cr);
//         }
//       });
//     console.log(messiproduct);


    


//     await browser.close() 
// }

// main()

const { default: puppeteer } = require('puppeteer');
const { writeFile } = require('fs/promises');
const { load } = require('cheerio');

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 1080,
      width: 1920,
    },
  });
  const page = await browser.newPage();
  await page.goto('https://www.amazon.in/');
  await page.type('#twotabsearchtextbox', 'messi'); // Search for "messi" on Amazon
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);

  const searchResults = [];
  const $ = load(await page.content());

  $('.s-result-item').each((_, element) => {
    const productCard = $(element);
    const title = productCard.find('.a-text-normal').text().trim();
    const price = productCard.find('.a-price .a-offscreen').text().trim();
    const imageLink = productCard.find('img.s-image').attr('src');

    searchResults.push({
      title,
      price,
      imageLink,
    });
  });

  const jsonData = JSON.stringify(searchResults, null, 2);
  await writeFile('amazonSearchResults.json', jsonData);
  await browser.close();
};

main();
