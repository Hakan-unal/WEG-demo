let users = []


const postMethod = (json) => {
    console.log(json)
    try {
        const tempArr = JSON.parse(json);
        users = tempArr;
        return true
    }
    catch {
        return false
    }
}

const getMethod = () => {
    try {
        const tempArr = [...users];
        return tempArr
    }
    catch {
        return false
    }
}

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            console.log(req.body)
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