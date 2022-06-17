let messages = []


const postMethod = (json) => {
    try {
        const tempArr = [...messages];
        const obj = {
            name: json,
            id: parseInt(Math.random() * 1000000)
        }
        tempArr.push(obj)
        messages = tempArr;
        return obj
    }
    catch {
        return false
    }
}

const getMethod = () => {
    try {
        const tempArr = [...messages];
        return tempArr
    }
    catch {
        return false
    }
}

const deleteMethod = (dataID) => {
    try {
        const tempArr = messages.filter((val) => val.id !== parseInt(dataID))
        messages = tempArr
        return true
    }
    catch {
        return false
    }
}

const putMethod = (data) => {
    const value = JSON.parse(data)
    try {
        const tempArr = messages.map((val) => {
            if (val.id !== parseInt(value.id)) return val
            else {
                return {
                    ...val,
                    name: value.name
                }
            }
        })
        messages = tempArr
        return true
    }
    catch {
        return false
    }
}




export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            const postResult = await postMethod(req.body)
            if (postResult) {
                res.status(200).json({ message: "Success post method", data: postResult });
            } else {
                res.status(400).json({ message: "Error" });
            }
            break;


        case "GET":

            const getResult = await getMethod()
            if (getResult) {
                res.status(200).json({ message: "Success get method", data: getResult });
            } else {
                res.status(400).json({ message: "Error" });
            }

            break;

        case "PUT":

            const putResult = await putMethod(req.body)
            if (putResult) {
                res.status(200).json({ message: "Success put method" });
            } else {
                res.status(400).json({ message: "Error" });
            }

            break;

        case "DELETE":
            const deleteResult = await deleteMethod(req.body)
            if (deleteResult) {
                res.status(200).json({ message: "Success delete method" });
            } else {
                res.status(400).json({ message: "Error" });
            }
            break;

        default: res.status(400).json({ name: 'error' }); break;
    }
}