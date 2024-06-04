using AutoMapper;
using Mango.Services.ProductApi.Data;
using Mango.Services.ProductApi.Models;
using Mango.Services.ProductApi.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Mango.Services.ProductApi.Controllers
{
    [Route("api/product")]
    [ApiController]
    [Authorize]
    public class ProductAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ResponseDTO _response;
        private readonly IMapper _mapper;

        public ProductAPIController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _response = new ResponseDTO();
            _mapper = mapper;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ResponseDTO> GetAllProducts()
        {
            try
            {
                List<Product> allProducts = await _db.Products.ToListAsync();
                List<ProductDTO> products = _mapper.Map<List<ProductDTO>>(allProducts);
                var request = HttpContext.Request;
                var baseUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
                for (int i=0; i < products.Count(); i++)
                {

                    products[i].ImageUrl = baseUrl + products[i].ImageUrl;
                }
                _response.Result = products;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }


        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ResponseDTO> GetProductById([FromRoute] int id) {
            try
            {
                Product foundProduct = await _db.Products.FirstAsync(product => product.ProductId == id);
                ProductDTO foundProductDTO = _mapper.Map<ProductDTO>(foundProduct);
                // attching host port to image to display
                var request = HttpContext.Request;
                var baseUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
                foundProductDTO.ImageUrl = baseUrl+foundProductDTO.ImageUrl;
                _response.Result = foundProductDTO;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }


        [HttpPut("{id:int}")]
        [Authorize(Roles ="Admin")]
        public async Task<ResponseDTO> UpdateProduct([FromRoute] int id, [FromForm] ProductDTO productDTO)
        {
            try
            {
                Product product = await _db.Products.FirstAsync(product => product.ProductId == id);
                product.Name = productDTO.Name;
                product.Price = productDTO.Price;
                product.Description = productDTO.Description;
                product.CategoryName = productDTO.CategoryName;
                string tempUrl = product.ImageUrl;

                if (productDTO.Image != null && productDTO.Image.Length != 0)
                {
                    string FileName = productDTO.Image.FileName + DateTime.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss") + Path.GetExtension(productDTO.Image.FileName);
                    string FilePathDirectory = @"wwwroot\ProductImages\" + FileName;

                    using (FileStream stream = new FileStream(FilePathDirectory, FileMode.Create))
                    {
                        await productDTO.Image.CopyToAsync(stream);
                    }


                    product.ImageUrl = "/ProductImages/" + FileName;

                    // once image is updated delete previous image
                    if(tempUrl != null && tempUrl.Length > 0 )
                    {
                        string imagePathToBeDelete = @"wwwroot\" + tempUrl.Replace("/", "\\");
                        FileInfo file = new FileInfo(imagePathToBeDelete);
                        if (file.Exists)
                        {
                            file.Delete();
                        }
                    }
                    
                }

                

                _db.Products.Update(product);
                await _db.SaveChangesAsync();
                _response.Result = productDTO;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> CreateProduct([FromForm]ProductDTO productDTO)
        {
            try
            {
                Product newProduct = _mapper.Map<Product>(productDTO);
                _db.Products.Add(newProduct);
                await _db.SaveChangesAsync();

                if(productDTO.Image != null && productDTO.Image.Length !=0)
                {
                    string FileName = productDTO.Image.FileName + new Guid().ToString() + Path.GetExtension(productDTO.Image.FileName);
                    string FilePathDirectory = @"wwwroot\ProductImages\"+FileName;

                    using (FileStream stream = new FileStream(FilePathDirectory, FileMode.Create))
                    {
                        await productDTO.Image.CopyToAsync(stream);
                    }


                    newProduct.ImageUrl = "/ProductImages/"+FileName;
                }
                _db.Products.Update(newProduct);
                await _db.SaveChangesAsync();
                _response.Result = newProduct;
            } catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> DeleteProduct([FromRoute]int id)
        {
            try
            {
                Product foundProduct = await _db.Products.FirstAsync(product => product.ProductId == id);
                _db.Products.Remove(foundProduct);
                int numberOfDeletedData = await _db.SaveChangesAsync();

                // once image is updated delete previous image
                if (foundProduct.ImageUrl != null && foundProduct.ImageUrl.Length > 0) { 
                    string imagePathToBeDelete = @"wwwroot\" + foundProduct.ImageUrl.Replace("/", "\\");
                    FileInfo file = new FileInfo(imagePathToBeDelete);
                    if (file.Exists)
                    {
                        file.Delete();
                    }
                }

                _response.Result = numberOfDeletedData;

            }catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }


    }
}
