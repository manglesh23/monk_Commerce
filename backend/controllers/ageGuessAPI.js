import axios from "axios";

export  const getTheCandidateAge = async (req,res) => {
  try {
    console.log("age controller")
    let {name}=req.query;
    console.log("NAme:-",name)
    // let name="manglesh"
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.agify.io?name=${name}`,
      headers: {},
    };

    let response = await axios(config);
    console.log(response.data)
    res.status(200).json({ msg: response.data });
  } catch (e) {
    res.status(500).json({ error: e });
    console.log(e);
  }
};
// await getTheCandidateAge()
