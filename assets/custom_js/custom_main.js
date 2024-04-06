function loadContent(originURL, tabName) {
    


    // fetch(`tabs/${tabName}.html`)
    fetch(`${originURL}${tabName}.html`)
        .then(response => response.text())
        .then(html => {
            console.log('Content loaded:', this);
            document.getElementById('main').innerHTML = html;

            if (tabName === 'tab_publications') {
                loadGoogleScholar();
            }
            // 모든 요소에서 current 클래스를 제거합니다.
            // const tabs = document.querySelectorAll('.nav');
            // tabs.forEach(tab => {
            //     tab.classList.remove('current');
            // });
            // 클릭된 버튼에 current 클래스를 추가합니다.
            // const clickedButton = event.target; // Fix: Use the event object to access the target element
            // clickedButton.classList.add('current');
        })
        .catch(error => {
            console.error('Error loading the content:', error);
            document.getElementById('content').innerHTML = '<p>Error loading content.</p>';
        });
    
}
function loadGoogleScholar(){
        const PROXY_URL = 'https://corsproxy.io/?';
        const TARGET_URL = 'https://scholar.google.co.kr/citations?hl=ko&user=UXkPpDsAAAAJ&view_op=list_works&sortby=pubdate';
        // const MOBILE_TARGET_URL = 'https://scholar.google.co.kr/m/citations?hl=ko&user=UXkPpDsAAAAJ&view_op=list_works&sortby=pubdate';
        console.log("hello this is pub")
        fetch(PROXY_URL + TARGET_URL)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const element = doc.querySelector('#gs_bdy_ccl');
                
                // const extractedData = element.innerHTML;
                const extractedDiv = doc.querySelector('#gsc_a_tw');
                //정렬 제거
                const sortButton = extractedDiv.querySelector('#gsc_dd_sort-r');
                sortButton.remove();
                //인용 제거
                const gsNphElements = extractedDiv.querySelectorAll('.gs_nph');
                gsNphElements.forEach(element => {
                    element.remove();
                }
                );
                //제목 a 태그 -> div 태그로 변경
                const gscaElements = extractedDiv.querySelectorAll('.gsc_a_a');
                gscaElements.forEach(element => {
                    const divElement = document.createElement('div');
                    divElement.innerHTML = element.innerHTML;
                    element.parentNode.replaceChild(divElement, element);
                });
                //gsc_a_err 제거
                const gscErrElements = extractedDiv.querySelectorAll('#gsc_a_err');
                gscErrElements.forEach(element => {
                    element.remove();
                });

                document.getElementById('publications-google').innerHTML = extractedDiv.outerHTML;
                console.log("hello this is pub");
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.nav-tab');
    const homeNav = document.querySelector('#home-nav');
    const navTabHome = document.querySelector('#nav-tab-home');
    // const homeNav = document.getElementById('home-nav');
    console.log(`window.location.hostname: ${window.location.hostname}`)
    console.log(`tabs: ${tabs}`)
    // const baseURL = origin.includes('localhost') || origin.includes('127.0.0.1') ? origin : origin + "/JJKim_LabHomePage";
    let baseURL = window.location.pathname;
    if(baseURL === "/"){
        // baseURL = "";
    }
    baseURL = baseURL.replace("index.html", "");
    console.log(`baseURL: ${baseURL}`)
    let homeAnchor = homeNav.querySelector('a');
    homeAnchor.addEventListener('click', function(event) {
        event.preventDefault();

        const anchor = navTabHome.querySelector('a');
        anchor.click();
    });
    tabs.forEach(tab => {
        const anchor = tab.querySelector('a');
        anchor.addEventListener('click', function(event) {
            // Prevent the default action (i.e., following the link)
            console.log(`baseURL1: ${baseURL}`)

            event.preventDefault();

            // 현재 active 클래스를 가진 모든 요소에서 active 클래스를 제거합니다.
            tabs.forEach(t => t.classList.remove('current'));
            
            // 클릭된 탭에 active 클래스를 추가합니다.
            tab.classList.add('current');
            
            const tabName = this.getAttribute('href').split('=')[1];
            if (!tabName) {
                tabName = "home"
            }
            let tab_url = `tab_${tabName}`
            // If the 'tab' query parameter is not specified, default to 'tab_home'

            // Load the corresponding tab
            loadContent(baseURL, tab_url);
            history.pushState(null, '', `${baseURL}?tab=${tabName}`);
            // Activate the corresponding tab
            // const tabToActivate = document.querySelector(`#nav-tab-${tabName}`);
            // if (tabToActivate) {
            //     tabToActivate.classList.add('current');
            // }
            console.log(`/?tab=${tabName}`);

        });
    });

    console.log("hello 1");
    const urlParams = new URLSearchParams(window.location.search);
    let tabName = urlParams.get('tab');
    if (!tabName) {
        tabName = "home"
    }
    let tab_url = `tab_${tabName}`
    // If the 'tab' query parameter is not specified, default to 'tab_home'

    // Load the corresponding tab
    loadContent(baseURL, tab_url);

    // Activate the corresponding tab
    const tabToActivate = document.querySelector(`#nav-tab-${tabName}`);
    if (tabToActivate) {
        tabToActivate.classList.add('current');
    }
});
