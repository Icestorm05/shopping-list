exports.convertObjectID = (obj) => {
    return {...obj, _id: String(obj._id)};
}
