import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'poc-angular-quicksight';

  containerDiv: any;

  frameOptions: QuickSightEmbedding.QSE.FrameOptions;
  contentOptions: QuickSightEmbedding.QSE.ContentOptions;
  embeddingContext: QuickSightEmbedding.QSE.EmbeddingContext;
  dashboardFrame : QuickSightEmbedding.QSE.DashboardFrame;
  dashboardURL: string = "https://eu-west-2.quicksight.aws.amazon.com/embed/124796bdf9b24609bcbf68b75ce6ffda/dashboards/75e780a3-6073-4b6c-b473-3cd201a53e24?code=AYABeFzhfk2MSrcSYVf4Wpo3xQkAAAABAAdhd3Mta21zAEthcm46YXdzOmttczpldS13ZXN0LTI6NjQ5MTA0MjA5NDE4OmtleS9lZGQ0ZjBlNC03M2U0LTQ4NGEtYjBmYy0yYjEzNDI0YThlODUAuAECAQB4PzZ65b9Ymmq2TEsvgSjBFtVfn3zhydm1pFtLkt4ms00Bl7_FavO7md_-tnqXHvJVVAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDN3B5kQUwFFC3nbjAwIBEIA7kzsJHRwhPLJxJgIHNVlhgBdz-yDN4hbcQMkfe4gvS3obSWbFN9B7RTWXfu30nqbEaBzzjs-Yhnhyuk8CAAAAAAwAABAAAAAAAAAAAAAAAAAAh1Ww791e4zw_BTbswDBSsv____8AAAABAAAAAAAAAAAAAAABAAAAm0LQ3OJNIabAZUEpYVvrS5c-jYJTOqze3Bo4HSQjGH8xNtPgNcBNriYDsG4TNdCfJ3_FeLzpxqoQepMxZhUJiAJh-nT9f-NHKChpPkeXvvAsElRtR0pa28o_igUiN8jdSFow74B61XRGGAs00le46_2MAKMIOW5ILNEyE-juxO6bqprGkDuTRgZZPgh_LlTKflvBLHDY-6vkpe1U6mgVa1Cd9Ndb49s3b2AuEw%3D%3D&identityprovider=quicksight&isauthcode=true";

  async ngOnInit() {
    this.containerDiv = document.getElementById("dashboardContainer");

    this.frameOptions = {
      url: this.dashboardURL, 
      container: this.containerDiv,      
      width: '100%',
      height: '700px',
      onChange: (changeEvent, metadata) => {
        if (changeEvent.eventLevel === 'ERROR') {
            console.log(`Do something when embedding experience failed with "${changeEvent.eventName}"`);
            return;
        }
        switch (changeEvent.eventName) {
            case 'FRAME_MOUNTED': {
                console.log("Do something when the experience frame is mounted.");
                break;
            }
            case 'FRAME_LOADED': {
                console.log("Do something when the experience frame is loaded.");
                break;
            }
            //...
        }
      },
    };
    
    this.contentOptions = {
        parameters: [
          {
              Name: 'country',
              Values: [
                  'United States'
              ],
          },
          {
              Name: 'states',
              Values: [
                  'California',
                  'Washington'
              ]
          }
      ],
      locale: "en-US",
      /*sheetOptions: {
          initialSheetId: '<YOUR_SHEETID>',
          singleSheet: false,                        
          emitSizeChangedEventOnSheetChange: false,
      },*/
      toolbarOptions: {
          export: false,
          undoRedo: false,
          reset: false
      },
      attributionOptions: {
          overlayContent: false,
      },
      onMessage: async (messageEvent, experienceMetadata) => {
        switch (messageEvent.eventName) {
          case 'CONTENT_LOADED': {
            console.log("All visuals are loaded. The title of the document:", messageEvent.message.title);
            break;
        }
        case 'ERROR_OCCURRED': {
            console.log("Error occurred while rendering the experience. Error code:", messageEvent.message.errorCode);
            break;
        }
        case 'PARAMETERS_CHANGED': {
            console.log("Parameters changed. Changed parameters:", messageEvent.message.changedParameters);
            break;
        }
        case 'SELECTED_SHEET_CHANGED': {
            console.log("Selected sheet changed. Selected sheet:", messageEvent.message.selectedSheet);
            break;
        }
        case 'SIZE_CHANGED': {
            console.log("Size changed. New dimensions:", messageEvent.message);
            break;
        }
        case 'MODAL_OPENED': {
            window.scrollTo({
                top: 0 // iframe top position
            });
            break;
        }
      }
    }
    }

    this.embeddingContext = await QuickSightEmbedding.createEmbeddingContext({
      onChange: (changeEvent) => {
          console.log('Context received a change', changeEvent);
      },
    });

    this.dashboardFrame = await this.embeddingContext.embedDashboard(this.frameOptions, this.contentOptions);
  }

  onDashboard(event: any) {
    console.log("Hello Dashboard");
  }  
}
