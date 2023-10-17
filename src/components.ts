import { DailyMenu, WeeklyMenu } from "./interfaces/Menu";
import { Restaurant } from "./interfaces/Restaurant";


const restaurantRow = (restaurant: Restaurant) => {
  const { name, address } = restaurant;
  const tr = document.createElement('tr');
  const nameCell = document.createElement('td');
  nameCell.innerText = name.toString();
  const addressCell = document.createElement('td');
  addressCell.innerText = address.toString();
/*   const companyCell = document.createElement('td');
  companyCell.innerText = company.toString(); */
 /* const buttonCell1 = document.createElement('td');
  const weeklyButton = document.createElement('button');
  weeklyButton.innerText = 'Weekly';
  weeklyButton.id = `weekly_${restaurant._id}`;
  const buttonCell2 = document.createElement('td');
  const dailyButton = document.createElement('button');
  dailyButton.innerText = 'Daily';
  dailyButton.id = `daily_${restaurant._id}` */

/*buttonCell1.appendChild(weeklyButton);
  buttonCell2.appendChild(dailyButton); */

  tr.appendChild(nameCell);
  tr.appendChild(addressCell);
/*   tr.appendChild(companyCell); */
/* tr.appendChild(buttonCell1);
  tr.appendChild(buttonCell2); */

  return tr;
};


const dailyModal = (restaurant : Restaurant,  daily: DailyMenu) => {
  const {name, address, city, postalCode, phone, company} = restaurant;
  console.log(restaurant);
  let html = `<h3>${name}</h3>
  <p>${company}</p>
  <p>${address} ${postalCode} ${city}</p>
  <p>${phone}</p>
  <table>
    <tr>
      <th>Course</th>
      <th>Diet</th>
      <th>Price</th>
    </tr>
  `;
  daily.courses.forEach(course => {
    const {name, diets, price} = course;
    html += `
    <tr>
      <td>${name}</td>
      <td>${diets ?? ' - '}</td>
      <td>${price ?? ' - '}</td>
    </tr>
    `;
  });

  html += '</table>';
  console.log(html);
  return html;
};

const weeklyModal = (restaurant : Restaurant, weekly:WeeklyMenu) => {
  const {name, address, city, postalCode, phone, company} = restaurant;
  let html = `<h3>${name}</h3>
    <p>${company}</p>
    <p>${address} ${postalCode} ${city}</p>
    <p>${phone}</p>
    <table>
    <tr>
      <th>Name</th>
      <th>Diet</th>
      <th>Price</th>
    </tr>`;
    weekly.days.forEach(day => {
    const {date} = day;
    html += `
    <tr>
      <th colspan="3">${date}</th>
    </tr>
  `;
      day.courses.forEach(course => {
          const {name, diets, price} = course;
          html += `
            <tr>
              <td>${name}</td>
              <td>${diets ?? ' - '}</td>
              <td>${price ?? ' - '}</td>
            </tr>
            `;
        });
  });

  html += '</table>';
  return html;
};

const errorModal = (message: string) => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};
export {restaurantRow, dailyModal, weeklyModal , errorModal};
