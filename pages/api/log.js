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

        default: res.status(400).json({ name: 'error' }); break;
    }
}