using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Client
{
    class ClientInfo
    {
        private string clientdetails;
        public string ClientDetails
        {
            get
            {
                return clientdetails;
            }
        }
        public ClientInfo()
        {
            // gather clientinfo and create new JSON OBJ
            dynamic client = new JObject();
            client.id = Environment.MachineName;
            client.type = "client";

            // create clientdetail with name client JSON OBJ
            dynamic clientinfo = new JObject();
            clientinfo.client = client;

            clientdetails = clientinfo.ToString();
        }
    }
}
