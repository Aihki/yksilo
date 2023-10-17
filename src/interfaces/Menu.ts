interface Course{
    name: string;
    price: string;
    diets: string;
}

interface DailyMenu{
    _id: string;
    courses: Course[];

}
interface days{
    date:string;
    courses: Course[];

}
interface WeeklyMenu{
    _id: string;
    days:days[];


}
export type {DailyMenu,WeeklyMenu}
