package com.mukul.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;

@Controller
@RequestMapping("/proxy")
public class ProxyController {

    @Autowired
    private RestTemplate restTemplate;

    @RequestMapping(value = "/kratos/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<?> proxyKratosRequest(
            HttpServletRequest request,
            @RequestBody(required = false) String body,
            HttpMethod method) {

        // Construct URL for Kratos endpoint
        String requestUrl = "http://127.0.0.1:4433" + request.getRequestURI().replace("/proxy/kratos", "");
        if(request.getParameter("flow") != null){
            requestUrl = requestUrl+"?flow="+request.getParameter("flow");
        }
        // Create headers with cookies if present
        HttpHeaders headers = new HttpHeaders();
        headers.addAll(extractHeaders(request));

        // Create HTTP entity with body and headers
        HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);

        try {
            // Send request to Kratos
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    requestUrl,
                    method,
                    httpEntity,
                    String.class);

            return ResponseEntity.status(responseEntity.getStatusCode())
                    .headers(extractResponseHeaders(responseEntity))
                    .body(responseEntity.getBody());

        }catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 400) {
                System.out.println("400 Bad Request: " + e.getResponseBodyAsString());
            } else {
                System.out.println("HTTP Error: " + e.getStatusCode() + " " + e.getResponseBodyAsString());
            }
            return ResponseEntity.status(e.getStatusCode())
                    .headers(e.getResponseHeaders())
                    .body(e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println(e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    private HttpHeaders extractHeaders(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.set(headerName, request.getHeader(headerName));
        }
        return headers;
    }

    private HttpHeaders extractResponseHeaders(ResponseEntity<?> responseEntity) {
        HttpHeaders headers = new HttpHeaders();
        responseEntity.getHeaders().forEach((key, values) -> headers.addAll(key, values));
        return headers;
    }
}
