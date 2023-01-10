const dal = require("../data-access-layer/dal");
const Vacation= require("../model/vacationModel")
function getVacationAsync(id) {
    return dal.executeQueryAsync(`select * from vacation where vacationID=${id}`);
}

function getAllVacationAsync() {
    return dal.executeQueryAsync(`SELECT *  FROM vacation ORDER BY startDate`);
}

function getAllImageAsync() {
    return dal.executeQueryAsync(`SELECT image  FROM vacation ORDER BY startDate`);
}

function insertVacationAsync(vacation,image) {
    const newVacation = new Vacation(vacation)
    let errors = newVacation.validate();
    if (errors){
      return errors}
      else{
        return dal.executeQueryAsync(`
    INSERT INTO vacation
        (description,place,image ,startDate, endDate,price) 
        VALUES 
        ("${vacation.description}", "${vacation.place}", "${image}","${vacation.startDate}","${vacation.endDate}",${vacation.price})
    `);
}
}

function editVacationAsync(vacation,id,image) {
    const newVacation = new Vacation(vacation)
    let errors = newVacation.validate();
    if (errors){
      return errors}
      else{
  return dal.executeQueryAsync(`
    UPDATE vacation SET 
    description="${vacation.description}",place= "${vacation.place}", image="${image}",
    startDate="${vacation.startDate}",endDate="${vacation.endDate}",price= ${vacation.price}
    WHERE vacationID=${id}
    `)}
}

function deleteVacationAsync(id) {
    const result= dal.executeQueryAsync(`DELETE  FROM vacation WHERE vacationID=${id}`)
    console.log(result)
    return result
}

function increaceFollowAsync(id) {
    const result= dal.executeQueryAsync(`UPDATE vacation SET follow=follow+1  WHERE vacationID=${id} `)
     return result
 }
 function decreaceFollowAsync(id) {
    const result= dal.executeQueryAsync(`UPDATE vacation SET follow=follow-1  WHERE vacationID=${id} `)
     return result
 }
 
module.exports = {
    increaceFollowAsync,
    decreaceFollowAsync,
    getVacationAsync,
    getAllVacationAsync,
    getAllImageAsync,
    insertVacationAsync,
    editVacationAsync,
    deleteVacationAsync
}