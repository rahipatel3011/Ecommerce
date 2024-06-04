namespace Mango.Services.AuthApi.Models.DTOs
{
    public class ResponseDTO
    {
        public object Result { get; set; }
        public bool IsSuccess { get; set; } = true;
        public IEnumerable<String> Message { get; set; } = null;
    }
}
