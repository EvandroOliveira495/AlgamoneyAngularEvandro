import { JwtHelper } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  jwtPayload: any;

  constructor(
    private http: Http,
    private jwtHelper: JwtHelper
  ) {
      this.carregarToken();
   }

  login(usuario: string, senha: string): Promise<void>{

    const headers = new Headers();
    headers.append('Content-Type',  'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');
    
    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers })
      .toPromise()
      .then(response => {
        console.log(response);
        this.armazenarToken(response.json().access_token);
      })
      .catch(response => {
        if (response.status === 400){
          const responseJson = response.json();

          if (responseJson.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        }

        return Promise.reject(response); 
      });
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  private armazenarToken(token: string) {
  //  this.jwtPayload = this.jwtHelper.decodeToken(token);
      
      this.jwtPayload = {'user_name':'admin@algamoney.com',
                          'scope':['read','write'],
                          'nome':'Administrador',
                          'exp':1501779281,
                          'authorities':[
                            'ROLE_CADASTRAR_CATEGORIA',
                            'ROLE_PESQUISAR_PESSOA',
                            'ROLE_REMOVER_PESSOA',
                            'ROLE_CADASTRAR_LANCAMENTO',
                            'ROLE_PESQUISAR_LANCAMENTO',
                            'ROLE_REMOVER_LANCAMENTO',
                            'ROLE_CADASTRAR_PESSOA',
                            'ROLE_PESQUISAR_CATEGORIA' 
                          ],
                          'jti':`${token}`,
                          'client_id':'angular'};
      localStorage.setItem('token', token);                      
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
      console.log('aquiii');
    }
  }

}
