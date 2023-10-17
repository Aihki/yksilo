import {dailyModal, errorModal, restaurantRow, weeklyModal} from './components';
import {fetchData} from './functions';
import { DailyMenu, WeeklyMenu } from './interfaces/Menu';
/* import { Point } from './interfaces/Point'; */
import { Restaurant } from './interfaces/Restaurant';
import { UpdateResult } from './interfaces/UpdateResult';
import { UploadResult } from './interfaces/UploadResult';
import { CreatenUser, LoginUser, UpdateUser, User } from './interfaces/User';
import {apiUrl, positionOptions, uploadUrl} from './variables';


const checkbox: HTMLInputElement | null = document.getElementById("checkbox") as HTMLInputElement;

if (checkbox) {
  checkbox.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    const closest = document.querySelector('.closest');
    if (closest) {
      closest.classList.toggle("dark");
    }
    const editGrid = document.querySelector('.edit-grid');
    if (editGrid) {
      editGrid.classList.toggle("dark");
    }
    const menuDialog = document.querySelector('#menuDialog');
    if (menuDialog) {
      menuDialog.classList.toggle("dark");
      const menuDialogTable = menuDialog.querySelector('table');
      if (menuDialogTable) {
        menuDialogTable.classList.toggle("dark");
      }
      const menuDialogTds = menuDialog.querySelectorAll('table td');
      menuDialogTds.forEach((td) => {
        td.classList.toggle('dark');
      });
      const menuDialogThs = menuDialog.querySelectorAll('table th');
      menuDialogThs.forEach((th) => {
        th.classList.toggle('dark');
      });
    }
  });
}


let menuMode: boolean = true;
let isRestaurantTableVisible: boolean = true;



const logDialog: HTMLDialogElement | null = document.getElementById('logdialog') as HTMLDialogElement | null;
const openLog: HTMLButtonElement | null = document.getElementById('open_logdialog') as HTMLButtonElement | null;


if (!logDialog || !openLog) {
  throw new Error('Dialog or button not found');
}

openLog.addEventListener('click', () => {
  if (logDialog) {
    logDialog.showModal();
  }
});
const closeLog: HTMLButtonElement | null = document.getElementById('close_log') as HTMLButtonElement | null;
if (closeLog) {
  closeLog.addEventListener('click', () => {
    if (logDialog) {
      logDialog.close();
    }
  });
}
const regDialog: HTMLDialogElement | null = document.getElementById('reqdialog') as HTMLDialogElement | null;
const openreg: HTMLButtonElement | null = document.getElementById('open_regdialog') as HTMLButtonElement | null;


if (!regDialog || !openreg) {
  throw new Error('Dialog or button not found');
}

openreg.addEventListener('click', () => {
  if (regDialog) {
    regDialog.showModal();
  }
});
const closeReg: HTMLButtonElement | null = document.getElementById('close_reg') as HTMLButtonElement | null;
if (closeReg) {
  closeReg.addEventListener('click', () => {
    if (regDialog) {
      regDialog.close();
    }
  });
}



const modal = document.querySelector('dialog') ;

if (!modal) {
  throw new Error('Modal not found');
}
modal.addEventListener('click', () => {
  modal.close();
});
const loginForm: HTMLFormElement | null = document.querySelector('#login-form');
const regForm: HTMLFormElement | null = document.querySelector('#reg-form');
const profileForm: HTMLFormElement | null = document.querySelector('#profile-form');
const avatarForm: HTMLFormElement | null = document.querySelector('#avatar-form');




const loginUsernameInput = document.querySelector('#log-username') as HTMLInputElement | null;
const loginPasswordInput = document.querySelector('#log-password') as HTMLInputElement | null;

const registrationUsernameInput = document.querySelector('#reg-username') as HTMLInputElement | null;
const registrationPasswordInput = document.querySelector('#reg-password') as HTMLInputElement | null;

const emailInput = document.querySelector(
  '#email'
) as HTMLInputElement | null;

const profileUsernameInput = document.querySelector(
  '#profile-username'
) as HTMLInputElement;
const profileEmailInput = document.querySelector(
  '#profile-email'
) as HTMLInputElement;

const avatarInput = document.querySelector(
  '#avatar'
) as HTMLInputElement | null;

const usernameTarget: HTMLElement | null = document.querySelector('#username-target');
const emailTarget: HTMLElement | null = document.querySelector('#email-target');
const avatarTarget: HTMLImageElement | null = document.querySelector('#avatar-target');


const registration = async (user: {
  username: string;
  email: string;
  password: string;
}): Promise<CreatenUser> => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };
  return await fetchData<CreatenUser>(apiUrl + '/users', options);
};


const login = async (user: {
  username: string;
  password: string;
}): Promise<LoginUser> => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };
  return await fetchData<LoginUser>(apiUrl + '/auth/login', options);
};
const uploadAvatar = async (
  image: File,
  token: String
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('avatar', image);

  const options: RequestInit = {
    method: 'POST',
    headers: {
    Authorization: 'Bearer ' + token,
    },
    body: formData,
  };
  return await fetchData(apiUrl + '/users/avatar', options);
};

const updateUserData = async (
  user: UpdateUser,
  token: string
): Promise<UpdateResult> => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(user),
  };
  return await fetchData(apiUrl + '/users', options);
};

const addUserDataToDom = (user: User): void => {
  if (
    !usernameTarget ||
    !emailTarget ||
    !avatarTarget ||
    !profileEmailInput ||
    !profileUsernameInput
  ) {
    return;
  }

  usernameTarget.innerHTML = user.username;
  emailTarget.innerHTML = user.email;
  (avatarTarget as HTMLImageElement).src = uploadUrl + user.avatar;

  profileEmailInput.value = user.email;
  profileUsernameInput.value = user.username;

};


const getUserData = async (token: string): Promise<User> => {
  const options: RequestInit = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  return await fetchData<User>(apiUrl + '/users/token', options);
};

const checkToken = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }
  const userData = await getUserData(token);
  addUserDataToDom(userData);
  console.log(userData);
}


checkToken();




loginForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!loginUsernameInput || !loginPasswordInput) {
    return;
  }

  const user = {
    username: loginUsernameInput.value,
    password: loginPasswordInput.value,
  };
  const loginData = await login(user);
  console.log(loginData);
  localStorage.setItem('token', loginData.token);
  addUserDataToDom(loginData.data);
  if (logDialog) {
    logDialog.close();
  }
});

regForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!registrationUsernameInput || !registrationPasswordInput || !emailInput) {
    return;
  }

  const user = {
    username: registrationUsernameInput.value,
    email: emailInput.value,
    password: registrationPasswordInput.value,
  };
  const regData = await registration(user);
  console.log(regData);
  if (regDialog) {
    regDialog.close();
  }
});

profileForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!profileUsernameInput || !profileEmailInput) {
    return;
  }
  const user = {
    username: profileUsernameInput.value,
    email: profileEmailInput.value,
  };
  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }
  const userUpdate = await updateUserData(user, token);
  console.log(userUpdate);
  checkToken();
});


avatarForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!avatarInput?.files) {
    return;
  }

  const image = avatarInput.files[0];
  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }
  const avatarData = await uploadAvatar(image, token);
  console.log(avatarData);
  checkToken();
});



const restaurantTable: HTMLElement = document.querySelector('.restaurant-table') as HTMLElement;
const profileEdit: HTMLElement = document.querySelector('.profile-edit') as HTMLElement;
const avatarbtn: HTMLImageElement = document.getElementById('avatar-target') as HTMLImageElement;

console.log(avatarbtn);

if (!avatarbtn) {
  throw new Error('Button does not exist');
}
avatarbtn.addEventListener("click", () => {
  console.log('Avatar clicked');
  if (restaurantTable && profileEdit) {
    if (isRestaurantTableVisible) {
      restaurantTable.style.display = 'none';
      profileEdit.style.display = 'block';
    } else {
      restaurantTable.style.display = 'block';
      profileEdit.style.display = 'none';
    }
    isRestaurantTableVisible = !isRestaurantTableVisible;
  }
});

  const  calculateDistance = (lat1 :number, lon1: number, lat2 :number, lon2: number) => {
    const R: number = 6371;
    let dLat :number = deg2rad(lat2-lat1);
    let dLon :number = deg2rad(lon2-lon1);
    let a :number =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  }

const  deg2rad = (deg: number) => {
    return deg * (Math.PI/180)
  }
  const createTable = (restaurants: Restaurant[]) => {
    const table = document.querySelector('table');
    if (!table) {
      throw new Error('table doesn\'t exist');
    }


    const rows = table.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => row.remove());

    restaurants.forEach(async (restaurant, index) => {
      const tr = restaurantRow(restaurant);

      if (index === 0) {
        if (!tr.classList.contains('closest')) {
          tr.classList.add('closest');
        }
        if (tr.classList.contains('dark') && tr.classList.contains('closest')) {
          tr.classList.add('dark');
          tr.classList.add('closest');
        }
      }

      if (table) {
        table.appendChild(tr);
      }
      tr.addEventListener('click', async () => {
        try {
          const weekly = await fetchData<WeeklyMenu>(
            apiUrl + `/restaurants/weekly/${restaurant._id}/fi`
          );

          const daily = await fetchData<DailyMenu>(
            apiUrl + `/restaurants/daily/${restaurant._id}/fi`
          );

          if (menuMode === true) {
            modal.innerHTML = '';
            const weeklyMenu = weeklyModal(restaurant, weekly);
            modal.insertAdjacentHTML('beforeend', weeklyMenu);
            modal.showModal();
          } else {
            modal.innerHTML = '';
            const dailyMenu = dailyModal(restaurant, daily);
            modal.insertAdjacentHTML('beforeend', dailyMenu);
            modal.showModal();
          }
        } catch (error) {
          modal.innerHTML = errorModal((error as Error).message);
          modal.showModal();
        }
      });
    });
  };



const error = (err: GeolocationPositionError) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};


const success = async (pos: GeolocationPosition) => {

  try {
    const crd = pos.coords;
    const restaurants = await fetchData<Restaurant[]>(apiUrl + '/restaurants');

    restaurants.sort((a, b) => {
      const lat1 = crd.latitude;
      const lon1 = crd.longitude;
      const lat2a = a.location.coordinates[1];
      const lon2a = a.location.coordinates[0];
      const distanceA = calculateDistance(lat1, lon1, lat2a, lon2a);
      const lat2b = b.location.coordinates[1];
      const lon2b = b.location.coordinates[0];
      const distanceB = calculateDistance(lat1, lon1, lat2b, lon2b);

      return distanceA - distanceB;
    });
    createTable(restaurants);
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const searchText: string = searchInput.value.toLowerCase();
        const filteredRestaurants = restaurants.filter(restaurant => {
          return (
            restaurant.name.toLowerCase().includes(searchText) ||
            restaurant.company.toLowerCase().includes(searchText) ||
            restaurant.city.toLowerCase().includes(searchText) ||
            restaurant.postalCode.toLowerCase().includes(searchText) ||
            restaurant.address.toLowerCase().includes(searchText)
          );
        });

        createTable(filteredRestaurants);
      });
    }



    const dailyMenuBtn = document.querySelector('#weekly_menu');
    const weeklyMenuBtn = document.querySelector('#daily_menu');

    if (dailyMenuBtn !== null) {
      dailyMenuBtn.addEventListener("click", () => {
        menuMode = true;
      });

   } if (weeklyMenuBtn !== null) {
          weeklyMenuBtn.addEventListener("click", () => {
            menuMode = false;
          });
  }

  } catch (error) {
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }
};



navigator.geolocation.getCurrentPosition(success, error, positionOptions);






