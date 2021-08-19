export default class CatsApi{

  constructor(api){
    this.api = api;
    this.testCache = {};
    this.shift = new Date().getHours() > 12? "PM" : "AM";
  }

  fetchCats(locations, callback){
    this.api.get('/as/locate.php',(body)=>{
        let cats = [];
        let doc = new DOMParser().parseFromString(body, 'text/html');
        let rows = doc.getElementsByTagName('tr');
        for(var i = 1; i < rows.length; i++){
          let data = rows[i].getElementsByTagName('td');
          let link = data[1].getElementsByTagName('a')[0];
          let cat = {name: link.innerHTML, url:link.getAttribute('rel'), location: data[5].innerHTML,
            id: link.getAttribute('rel').split('?id=')[1]}
          if(locations.includes(cat.location))cats.push(cat);
        }
        cats.sort((c1, c2)=>{
          if(c1.name > c2.name)return 1;
          if(c1.name < c2.name)return -1;
          return 0;
        });
        callback(cats);
    });
  }

  fetchThumb(cat, callback, ignoreThumb){
    let url = localStorage.getItem(cat.id+'_thumb');
    if(url && !ignoreThumb){
      callback(url);
      return;
    }
    this.api.makeRequest({method: 'GET', url: '/aj/getAnimal.php?id='+cat.id}, (body)=>{
      let doc = new DOMParser().parseFromString(body, 'text/html');
      if(doc.getElementsByTagName('img')[0]){
        let newUrl = doc.getElementsByTagName('img')[0].getAttribute('src');
        localStorage.setItem(cat.id+'_thumb', newUrl);
        callback(newUrl);
      }
    });
  }

  fetchTests(cat, callback){
    this.api.get('/ap/diagnostic.php?id='+cat.id, (body)=>{
      let tests = [];
      let shift = this.shift;
      let day = new Date().getDate();
      //day = 21;

      let doc = new DOMParser().parseFromString(body, 'text/html');
      let rows = doc.getElementsByTagName('tr');
      for(var i = 1; i < rows.length; i++){
        let data = rows[i].getElementsByTagName('td');
        let link = data[0].getElementsByTagName('a')[0];
        let test = {needed: new Date(data[2].innerHTML), given: data[1].innerHTML, neededStr: data[2].innerHTML,
          name: data[4].innerHTML, id: link.getAttribute('href').split('?id=')[1], selectedName: data[5].innerHTML};
        if(test.needed.getDate()===day && test.needed.getMonth()===new Date().getMonth()&&test.needed.getYear()===new Date().getYear()
        &&test.name.startsWith(shift))tests.push(test);
      }
      console.log(rows.length + " Tests Processed ("+(rows.length-tests.length)+" Discarded)");
      tests.sort((t1, t2)=>{
        if(t1.name > t2.name)return -1;
        if(t1.name < t2.name)return 1;
        return 0;
      });
      let curIndex = 0;
      if(tests.length > 0){
        let nextTest = ()=>{
          curIndex++;
          if(curIndex < tests.length)this.fetchTest(tests[curIndex], nextTest);
          else callback(tests);
        }
        this.fetchTest(tests[curIndex], nextTest);
      }else{
        callback(tests);
      }
    });
  }

  fetchTest(test, callback){
      this.fetchTestInfoInternal(test, ()=>{
        for(var i = 0; i < test.values.length; i++){
          if(test.values[i].name===test.selectedName)test.selected = i;
        }
        callback(test);
      });

  }

  fetchTestInfoInternal(test, callback){
    if(this.testCache[test.name]){
      test.values = this.testCache[test.name].values;
      test.t = this.testCache[test.name].t;
      callback(test);
    }else{
      this.api.get('/dia/update.php?id=' + test.id, (body)=>{
        let doc = new DOMParser().parseFromString(body, 'text/html');
        test.t = doc.querySelector('select[name=t] > option[selected=selected]').getAttribute('value');
        test.values = [];
        let testValues = doc.querySelectorAll('select[name=r] > option');
        for(var i = 0; i < testValues.length; i++){
          let value = testValues[i].getAttribute('value');
          if(value)test.values.push({name: testValues[i].innerHTML, value: value});
        }
        this.testCache[test.name] = {values: test.values, t: test.t};
        callback(test);
      });
    }
  }

  updateTest(test, callback){
    this.api.post('/dia/updateProcess.php', {id: test.id, t: test.t, r: test.values[test.selected].value, nd: test.neededStr, gd: test.neededStr}, (body)=>{
      console.log(body);
      callback();
    });
    //setTimeout(callback, 1000);
  }

}
