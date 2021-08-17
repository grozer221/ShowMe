namespace ShowMe.Models
{
    public class ResponseModel
    {
        public int ResultCode { get; set; }
        public string[] Messages { get; set; }
        public dynamic Data { get; set; }
    }
}
