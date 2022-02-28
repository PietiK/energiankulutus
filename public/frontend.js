const getData = () => {
  fetch("/data", {method: "GET"})
    .then(res => { return res.json() })
    .then(data => {
      const container = document.getElementById("container");
      data.map((month) => {
        //Luodaan uusi table jokaiselle kuukaudelle
        const table = document.createElement("table");
        const headers = document.createElement("thead");
        const titlerow = document.createElement("tr");
        const title1 = document.createElement("td");
        title1.innerText = "Date";
        const title2 = document.createElement("td");
        title2.innerText = "Value";

        titlerow.appendChild(title1);
        titlerow.appendChild(title2);
        headers.appendChild(titlerow);
        table.appendChild(headers);

        month.map((paiva, index) => {
          //Lisataan jokaisen päivän arvo tableen
          const temppaiva = document.createElement("tr");
          const eka = document.createElement("td");
          const toka = document.createElement("td");
          eka.innerText = index + 1;
          toka.innerText = paiva;
          temppaiva.appendChild(eka);
          temppaiva.appendChild(toka);
          table.appendChild(temppaiva);
        })
        container.appendChild(table);
      })
    }) 
}