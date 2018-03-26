const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })

nightmare
    .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
    .goto('https://www.ddlvalley.me/category/movies/')
    //.type('#search_form_input_homepage', 'github nightmare')
    //.click('#search_button_homepage')
    .wait()
    .pdf('ddlvalley.pdf')
    .evaluate(function() {
        let titles = [];
        let imdb1 = [];
        let imdb2 = [];
        let object = [];

        let div = document.querySelector('#middle div.pb.fl');
        // get all titles
        div.querySelectorAll('h2 a').forEach(el => {
            titles.push(el.text);
        });
        // and imdb link
        div.querySelectorAll('div.post.br5.cl div.cont.cl div:nth-child(1) div div a:nth-child(1)').forEach(el => {
            imdb1.push(el.href);
        });
        div.querySelectorAll('div.post.br5.cl div.cont.cl div:nth-child(1) div div a:nth-child(2)').forEach(el => {
            imdb2.push(el.href);
        });

        for (i = 0; i < titles.length; i++) {
            let imdblink = imdb1[i];
            if (imdblink.indexOf('imdb.com') < 0) {
                imdblink = imdb2[i];
            }
            object[i] = {
                title: titles[i],
                link: imdblink
            }
        }
        // document.querySelectorAll('#middle div.pb.fl h2 a').forEach(el => {
        //     myarr.push(el.text);
        // });

        return object;
    })
    .end()
    .then(function(result) {
        console.log('Checking links...');
        for (let i = 0; i < 2; i++) {
            console.log(' Checking ' + result[i].link);
            var imdb = new Nightmare()
                .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
                .goto(result[i].link)
                .wait('#title-overview-widget')
                .evaluate(function() {
                    let newarray = [];

                    title = document.querySelector('#title-overview-widget div.vital div.title_block div div.titleBar div.title_wrapper h1').innerText
                    rating = document.querySelector('#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span').innerText

                    newarray.push(title + ' - ' + rating);
                    return newarray;
                })
                .end()
                .then(function(result) {
                    console.log('  ' + result);
                })
                .catch(error => {
                    console.error('IMDB search failed:', error)
                });
        }
    })
    .catch(error => {
        console.error('Search failed:', error)
    })

//  div.post.br5.cl div.cont.cl div:nth-child(1) div div a:nth-child(2)
//  div.post.br5.cl div.cont.cl div:nth-child(1) div div a:nth-child(1)
//  #title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1
//  #title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span