# Fast api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.exceptions import HTTPException as FastHTTPException
from starlette.exceptions import HTTPException as StarletteHTTPException
from pydantic import BaseModel
from color_analyser import anaylyze_and_save_report

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code, content=jsonable_encoder({"detail": exc.detail})
    )

@app.exception_handler(FastHTTPException)
async def fast_http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code, content=jsonable_encoder({"detail": exc.detail})
    )

class UrlBody(BaseModel):
    url: str

@app.post('/api/v1/analyze')
async def color_analyse(requestBody: UrlBody):
    return {
        'filePath': anaylyze_and_save_report(requestBody.url)
    }    